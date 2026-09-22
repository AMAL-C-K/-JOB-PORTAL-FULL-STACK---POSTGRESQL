from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import (
MultiPartParser,
FormParser,
JSONParser
)
from rest_framework.pagination import PageNumberPagination

from job.models import Job
from .models import Application
from .serializers import (
ApplicationSerializer,
ApplicationStatusUpdateSerializer
)

class ApplicationPagination(PageNumberPagination):

    page_size = 5

    page_size_query_param = 'page_size'

    max_page_size = 50


# Candidate applies for a job

class ApplyJobView(APIView):


    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser,FormParser,JSONParser]

    def post(self, request, job_id):

        if request.user.role != 'candidate':

            return Response({"error": "Only candidates can apply for jobs"},status=status.HTTP_403_FORBIDDEN)

        try:

            job = Job.objects.get(id=job_id)

        except Job.DoesNotExist:
            return Response({"error": "Job not found"},status=status.HTTP_404_NOT_FOUND)

        already_applied = Application.objects.filter(job=job,candidate=request.user).exists()

        if already_applied:
            return Response({"error": "You have already applied for this job"},status=status.HTTP_400_BAD_REQUEST)

        serializer = ApplicationSerializer(data=request.data)

        if serializer.is_valid():
            application = serializer.save(job=job,candidate=request.user)

            return Response(ApplicationSerializer(application).data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Employer views applicants for one of their jobs

class ViewApplicants(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):

        if request.user.role != 'employer':

            return Response({"error": "Only employers can view applicants"},status=status.HTTP_403_FORBIDDEN)

        try:

            job = Job.objects.get(id=job_id,employer=request.user)

        except Job.DoesNotExist:

            return Response({"error": "Job not found or access denied"},status=status.HTTP_404_NOT_FOUND)

        applications = job.applications.all().order_by('-applied_at')

        paginator = ApplicationPagination()

        result_page = paginator.paginate_queryset(
        applications,request)

        serializer = ApplicationSerializer(result_page,many=True)

        return paginator.get_paginated_response(serializer.data)

# Employer updates application status

class UpdateApplicationStatus(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self,request,application_id):

        if request.user.role != 'employer':
            return Response({"error": "Only employers can update application status"},status=status.HTTP_403_FORBIDDEN)

        try:
            application = Application.objects.get(id=application_id)

        except Application.DoesNotExist:

            return Response({"error": "Application not found"},status=status.HTTP_404_NOT_FOUND)

        if application.job.employer != request.user:

          return Response({"error": "You can only update applications for your own jobs"},status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationStatusUpdateSerializer(application,data=request.data,partial=True)

        if serializer.is_valid():

            serializer.save()

            return Response(ApplicationSerializer(application).data)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


# Employer views applications for all their jobs

class EmployerApplicationsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'employer':
            return Response({"error": "Only employers can view applications"},status=status.HTTP_403_FORBIDDEN)

        applications = Application.objects.filter(job__employer=request.user).order_by('-applied_at')

        paginator = ApplicationPagination()

        result_page = paginator.paginate_queryset(applications,request)

        serializer = ApplicationSerializer(result_page,many=True)

        return paginator.get_paginated_response(serializer.data)


# Candidate views own applications

class CandidateApplicationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'candidate':
            return Response({"error": "Only candidates can view their applications"},status=status.HTTP_403_FORBIDDEN)

        applications = Application.objects.filter(candidate=request.user).order_by('-applied_at')

        paginator = ApplicationPagination()

        result_page = paginator.paginate_queryset(applications,request)

        serializer = ApplicationSerializer(result_page,many=True)

        return paginator.get_paginated_response(serializer.data)

