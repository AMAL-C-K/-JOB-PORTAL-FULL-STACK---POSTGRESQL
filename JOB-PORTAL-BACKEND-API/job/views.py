from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Job
from .serializers import JobSerializer
from applications.models import Application
from django.db.models import Q


class JobPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 50


class JobListCreateView(APIView):
    """
    GET available jobs
    POST create a job
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        search = request.query_params.get("search", "").strip()

        if getattr(user, "role", None) == "candidate":
            applied_job_ids = Application.objects.filter(candidate=user).values_list("job_id", flat=True)

            jobs = Job.objects.exclude(id__in=applied_job_ids).order_by("-created_at")

        elif getattr(user, "role", None) == "employer":
            jobs = Job.objects.filter(employer=user).order_by("-created_at")

        else:
            jobs = Job.objects.all().order_by("-created_at")

        if search:
            jobs = jobs.filter(
            Q(title__icontains=search) |
            Q(location__icontains=search) |
            Q(description__icontains=search)
            )
        

        paginator = JobPagination()
        result_page = paginator.paginate_queryset(jobs, request)
        serializer = JobSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    
    def post(self, request):
        if getattr(request.user, "role", None) != "employer":
            return Response(
                {"error": "Only employers can create jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    """
    GET, PUT, PATCH, DELETE a specific job
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, job_id):
        try:
            return Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return None

    def get(self, request, job_id):
        job = self.get_object(job_id)
        if not job:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, job_id):
        job = self.get_object(job_id)
        if not job:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if getattr(request.user, "role", None) != "employer":
            return Response(
                {"error": "Only employers can update jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        if job.employer != request.user:
            return Response(
                {"error": "You can only update your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, job_id):
        job = self.get_object(job_id)
        if not job:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if getattr(request.user, "role", None) != "employer":
            return Response(
                {"error": "Only employers can update jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        if job.employer != request.user:
            return Response(
                {"error": "You can only update your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, job_id):
        job = self.get_object(job_id)
        if not job:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if getattr(request.user, "role", None) != "employer":
            return Response(
                {"error": "Only employers can delete jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        if job.employer != request.user:
            return Response(
                {"error": "You can only delete your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        job.delete()
        return Response(
            {"message": "Job deleted successfully"},
            status=status.HTTP_200_OK
        )


class MyJobsView(APIView):
    """
    GET jobs created by the logged-in employer
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if getattr(request.user, "role", None) != "employer":
            return Response(
                {"error": "Only employers can view their jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        jobs = Job.objects.filter(employer=request.user).order_by("-created_at")
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)