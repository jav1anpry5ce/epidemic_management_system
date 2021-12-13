from django.test import TestCase

from .models import Appointment

class AppointmentTestCase(TestCase):
    def setUp(self):
        instance_to_create = 50_000
        for i in range(0, instance_to_create):
            Appointment.objects.create()

    def test_queryset_exists(self):
        qs = Appointment.objects.all()
        self.assertTrue(qs.exists())