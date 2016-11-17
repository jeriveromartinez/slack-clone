import smtplib
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate
from conf.settings.base import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_USE_TLS, \
    DEFAULT_FROM_EMAIL
from pygithub3 import Github


class Email:
    _smtp = None

    def __init__(self):
        Email._smtp = smtplib.SMTP(host=EMAIL_HOST, port=EMAIL_PORT)

    @staticmethod
    def send(_subject='', _to='', _body=''):
        try:

            if EMAIL_USE_TLS:  # check the if and _smtp attr in the init definitions
                Email._smtp.ehlo()
                Email._smtp.starttls()
                Email._smtp.ehlo()
                Email._smtp.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            msg = MIMEMultipart()
            msg['From'] = DEFAULT_FROM_EMAIL
            msg['To'] = _to
            msg['Date'] = formatdate(localtime=True)
            msg['Subject'] = _subject
            msg['body'] = _body
            Email._smtp.sendmail(DEFAULT_FROM_EMAIL, _to, msg.as_string())
            Email._smtp.close()
        except Exception as e:
            print e


class Utils:
    def __init__(self):
        pass

    @staticmethod
    def commit():
        gh = Github(token="5bbb58704d16d7cd5d1dd3d5b00cea66d952c390", repo="MaintenanceSiteBundle")
        return gh.repos.commits.list()
