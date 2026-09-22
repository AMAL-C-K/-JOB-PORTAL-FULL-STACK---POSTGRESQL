from rest_framework.views import APIView
from .serializers import UserRegisterSerializer
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "User Registered Successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role
                }
            }, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


