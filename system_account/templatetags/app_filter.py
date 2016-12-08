import decimal
from django import template

register = template.Library()


@register.filter(name='next')
def next_item(value, arg):
    try:
        var = list(value)
        return var[int(arg) + 1]
    except Exception as e:
        print e


@register.filter(name='before')
def previous_item(value, arg):
    try:
        var = list(value)
        return var[int(arg) - 1]
    except Exception as e:
        print e


@register.filter(name='mbytes')
def MBytes(value):
    try:
        size = int(value / 1048576)
        if size is 0:
            return str(int(value / 1024)) + 'Kb'
        size = decimal.Decimal(size)
        return str(round(size, 2)) + 'Mb'
    except Exception as e:
        print e
