from django.urls import path

from .views import (
    ApplyJobView,
    ViewApplicants,
    UpdateApplicationStatus,
    EmployerApplicationsView,
    CandidateApplicationView
    )

urlpatterns = [
    path('apply/<int:job_id>/',ApplyJobView.as_view(),name='apply-job'),
    path('job/<int:job_id>/applicants/',ViewApplicants.as_view(),name='view-applicants'),
    path('<int:application_id>/status/',UpdateApplicationStatus.as_view(),name='update-application-status'),
    path('employer/',EmployerApplicationsView.as_view(),name='employer-applications'),
    path('my-applications/',CandidateApplicationView.as_view(),name='candidate-applications'),
]
