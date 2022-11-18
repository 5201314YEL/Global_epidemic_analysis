from django.db import models

# Create your models here.
class Epidemic(models.Model):
	Country = models.CharField(verbose_name="国家或地区",max_length=128)
	ConfirmAdd = models.IntegerField(verbose_name="新增人数")
	Confirm = models.IntegerField(verbose_name="累计确诊")
	Dead = models.IntegerField(verbose_name="死亡人数")
	Heal = models.IntegerField(verbose_name="治愈人数")
