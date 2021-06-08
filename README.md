# keel-webhook-action

Sends a webhook notification to a Keel instance on Kubernetes.

## Usage

Retagging a Github sha tag to latest.

```yaml
- name: Notify Kube Cluster about changes
  uses: VitraCash/keel-webhook-action@0.1.0
  with:
    name: '["vitracash/service1", "vitracash/service2"]'
    tag: '["latest", "staging"]'
    keel_webhook_url: https://keel.somedomain.com/v1/webhooks/native
    keel_webhook_auth_username: ${{ secrets.KEEL_WEBHOOK_AUTH_USERNAME }}
    keel_webhook_auth_password: ${{ secrets.KEEL_WEBHOOK_AUTH_PASSWORD }}
```

Auth is optional and is used to create HTTP Basic Auth Headers if your Keel installation used basic auth.

Every tag will be combined with every name. Alternatively you can also provide only the name variable with the tags included:

```yaml
name: '["vitracash/service1:latest", "vitracash/service2:staging"]'
```

The tag variable is optional.
