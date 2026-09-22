from django.urls import path
from .views import JobListCreateView,JobDetailView,MyJobsView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path( 'my-jobs/', MyJobsView.as_view(), name='my-jobs' ), 
    path( '<int:job_id>/', JobDetailView.as_view(), name='job-detail' ),
]