# Secure-Webhook

Securely call Webhook endpoint after your Action finishes

## Usage

Sending a json string, ``url`` and  ``hmacSecret`` are required fields. ``data`` and ``timeout`` is optional. ``timeout`` is in miliseconds.

```yaml
- name: Webhook
  uses: ramzzisudip/secure-github-webhook@0.3.0
  with:
    url: https://example.com
    data: '{ "example": "data" }'
    timeout: 2000
    hmacSecret: ${{ secrets.HMAC_SECRET }}
```

The request will include the header `X-Hub-Signature` and `X-Hub-Signature-256`, which are the hmac signatures of the raw body just like in Github webhooks, and also the header `X-Hub-SHA` which is the SHA of the commit running the github action.

Verify it on your endpoint for integrity.

## Contribution

> To contribute to this project simply do the following steps:

- Create a new fork of this repository.
- Clone the repository in your local mechine.
- Type ``npm insatll`` to install the dependencies.
- Edit/modify/add more codes.
- Type ``npm run build`` to build the dist.
- Finally create a *pull request* to my repository.

> Additional steps for testing.

- Add a ``.env`` file to your working directory which will contain the following variable.
  - INPUT_HMACSECRET: Represent ``hmacSecret`` in github action
  - INPUT_DATA: Represent ``data`` in github action
  - INPUT_TIMEOUT: Represent ``timeout`` in github action
  - INPUT_URL: Represent ``url`` in github action
  - GITHUB_SHA: Represent github sha of the workflow repo.
- Type ``npm run dev`` to run a debugger to test the code with the variables.

## Credit

- Thanks to <https://github.com/koraykoska/secure-actions-webhook> for providing the base signature generation code.

- Thanks to <https://github.com/navied/secure-webhook> for providing simple implementation.
