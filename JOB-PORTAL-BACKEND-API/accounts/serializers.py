
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role']
        )



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        token['user_id'] = user.id
        token['username'] = user.username
        token['role'] = user.role

        return token

    def validate(self, attrs):

        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role
        }

        return data
