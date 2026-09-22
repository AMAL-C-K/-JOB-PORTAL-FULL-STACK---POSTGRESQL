from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):

    employer_id = serializers.ReadOnlyField(
        source='employer.id'
    )

    employer_username = serializers.ReadOnlyField(
        source='employer.username'
    )

    class Meta:
        model = Job

        fields = [
           'id',
            'employer_id',
            'employer_username',
            'title',
            'description',
            'location',
            'job_type',
            'salary',
            'created_at',
        ]

        read_only_fields = [
           'id',
            'employer_id',
            'employer_username',
            'created_at',
        ]

