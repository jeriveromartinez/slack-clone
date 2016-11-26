import os
import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from django.utils.http import urlencode

import requests

from conf.settings.base import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL


class Email:
    def __init__(self):
        pass

    @staticmethod
    def send(_to='', _subject='', _body=''):
        try:
            _smtp = smtplib.SMTP(host=EMAIL_HOST, port=EMAIL_PORT)
            _smtp.ehlo()
            _smtp.starttls()
            _smtp.ehlo()
            _smtp.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            msg = MIMEMultipart()
            msg['From'] = DEFAULT_FROM_EMAIL
            msg['To'] = _to
            msg['Date'] = formatdate(localtime=True)
            msg['Subject'] = _subject
            msg.attach(MIMEText(_body))
            _smtp.sendmail(DEFAULT_FROM_EMAIL, _to, msg.as_string())
            _smtp.close()
        except Exception as e:
            print e


class ThreadIntegration(threading.local):
    thread = None

    def __init__(self, token, username, repo):
        self.token = token
        self.username = username
        self.repo = repo
        self.thread = threading.Timer(3, self.run)
        self.thread.daemon = True

    def run(self):
        self.thread.start()
        print self.username + ' - ' + self.repo

    def stop(self):
        self.thread.cancel()


class Request:
    def __init__(self):
        pass

    @staticmethod
    def test():
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0',
                       'Authorization': 'token 5bbb58704d16d7cd5d1dd3d5b00cea66d952c390'}
            url = 'https://api.github.com/repos/jeriveromartinez/MaintenanceSiteBundle/events'
            return requests.get(url=url, headers=headers, proxies=os.environ.get("PROXIES"), verify=False)
        except Exception as e:
            print e.message


def get_query_string(params, new_params=None, remove=None):
    if new_params is None: new_params = {}
    if remove is None: remove = []
    p = params.copy()
    for r in remove:
        for k in p.keys():
            if k.startswith(r):
                del p[k]
    for k, v in new_params.items():
        if v is None:
            if k in p:
                del p[k]
        else:
            p[k] = v
    return '?%s' % urlencode(p)
