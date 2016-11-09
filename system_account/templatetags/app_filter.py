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
