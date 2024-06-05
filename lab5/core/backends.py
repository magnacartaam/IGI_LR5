import logging
from django.contrib.auth.backends import ModelBackend
from django.db import models
from .models import User


logger = logging.getLogger(__name__)

# unused grabage maybe fix later
class EmailOrPhoneModelBackend(ModelBackend):
    def authenticate(self, request, username, password, **kwargs):
        logger.debug(f"Custom authenticate: {username}, {password}")
        try:
            # Try to fetch the user by email or phone number
            user = User.objects.get(models.Q(email=username) | models.Q(phone_number=username) | models.Q(username=username))
            if user.check_password(password):
                logger.debug("Password check succeeded")
                return user
        except User.DoesNotExist:
            logger.debug("User does not exist")
            return None
