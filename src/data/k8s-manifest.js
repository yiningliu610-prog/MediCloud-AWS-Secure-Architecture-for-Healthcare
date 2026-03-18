export const k8sManifest = `# Namespace with Pod Security Standards (Restricted)
apiVersion: v1
kind: Namespace
metadata:
  name: web
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
---
# Minimal-privilege ServiceAccount + Read-only Role
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-sa
  namespace: web
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: nginx-readonly
  namespace: web
rules:
  - apiGroups: [""]
    resources: ["pods","services","endpoints"]
    verbs: ["get","list","watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: nginx-readonly-binding
  namespace: web
subjects:
  - kind: ServiceAccount
    name: nginx-sa
    namespace: web
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: nginx-readonly
---
# Default deny ingress + allow only port 80
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: web
spec:
  podSelector: {}
  policyTypes: ["Ingress"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: nginx-allow-http
  namespace: web
spec:
  podSelector:
    matchLabels:
      app: nginx
  policyTypes: ["Ingress"]
  ingress:
    - ports:
        - protocol: TCP
          port: 80
---
# Hardened Deployment (non-root, read-only FS, dropped capabilities)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      serviceAccountName: nginx-sa
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        runAsUser: 101
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
              add: ["NET_BIND_SERVICE"]
          volumeMounts:
            - name: cache
              mountPath: /var/cache/nginx
            - name: run
              mountPath: /var/run
          resources:
            requests:
              cpu: "100m"
              memory: "64Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
      volumes:
        - name: cache
          emptyDir: {}
        - name: run
          emptyDir: {}`;
