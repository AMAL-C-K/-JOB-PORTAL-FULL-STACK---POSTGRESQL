from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_id = serializers.ReadOnlyField(source='candidate.id')
    candidate_username = serializers.ReadOnlyField(source='candidate.username')
    job_id = serializers.ReadOnlyField(source='job.id')
    job_title = serializers.ReadOnlyField(source='job.title')

    class Meta:
        model = Application
        fields = [
            'id',
            'job_id',
            'job_title',
            'candidate_id',
            'candidate_username',
            'cover_letter',
            'resume',
            'status',
            'applied_at',
        ]

        read_only_fields = [
            'id',
            'job_id',
            'job_title',
            'candidate_id',
            'candidate_username',
            'status',
            'applied_at',
        ]

    def validate_resume(self, value):
        if value:
            if not value.name.lower().endswith(".pdf"):
                raise serializers.ValidationError(
                    "Only PDF resumes are allowed."
                )

            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "Resume size must not exceed 5 MB."
                )

        return value


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = ['status']

    def validate_status(self, value):
        allowed_statuses = ['pending', 'accepted', 'rejected']

        if value not in allowed_statuses:
            raise serializers.ValidationError(
                "Invalid application status."
            )

        return value