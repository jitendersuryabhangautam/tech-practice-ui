export const kubernetesData = [
  {
    category: "Kubernetes Basics",
    topics: [
      {
        id: "pods",
        title: "Pods",
        category: "Core Concepts",
        description:
          "The smallest deployable unit in Kubernetes. A pod runs one or more containers.",
        explanation:
          "Pods are the atomic unit of deployment in Kubernetes - they represent one or more tightly coupled containers that share networking, storage, and lifecycle. Understanding pod lifecycle phases, container restart policies, init containers, and multi-container patterns (sidecar, ambassador, adapter) is fundamental.\n\nInterview focus:\n- Pod lifecycle and phases (Pending, Running, Succeeded, Failed, Unknown)\n- Container restart policies (Always, OnFailure, Never)\n- Multi-container patterns and communication\n- Pod networking (localhost communication, shared volumes)\n- Init containers vs sidecar containers\n- Resource requests vs limits and QoS classes\n- Pod affinity and anti-affinity\n- Troubleshooting CrashLoopBackOff, ImagePullBackOff, OOMKilled",
        code: `# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"`,
        command: `# Create pod from YAML
kubectl apply -f pod.yaml

# List pods
kubectl get pods
kubectl get pods -o wide

# Describe pod details
kubectl describe pod nginx-pod

# View pod logs
kubectl logs nginx-pod

# Execute command in pod
kubectl exec -it nginx-pod -- bash

# Delete pod
kubectl delete pod nginx-pod

# Delete pod immediately
kubectl delete pod nginx-pod --force --grace-period=0`,
        example: `# Multi-container pod
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080
  - name: sidecar
    image: logging-agent:latest

# Pod with environment variables
spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: DATABASE_URL
      value: "postgres://db:5432"
    - name: SECRET_KEY
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: secret-key`,
        useCase:
          "Running applications, debugging, sidecar patterns, init containers",
        interviewQuestions: [
          {
            question:
              "What is a Pod and why is it the basic unit in Kubernetes?",
            answer:
              "A Pod is the smallest deployable unit that can contain one or more containers sharing the same network namespace, IP address, and storage volumes. It's the basic unit because Kubernetes doesn't manage containers directly - it schedules, scales, and manages Pods. Containers in a Pod can communicate via localhost and share volumes.",
          },
          {
            question:
              "Explain Pod lifecycle phases. What does Pending mean vs Running?",
            answer:
              "Phases: Pending (accepted but not scheduled/images pulling), Running (bound to node, at least one container running), Succeeded (all containers terminated successfully), Failed (terminated with failure), Unknown (can't determine state). Pending often indicates scheduling issues or image pull problems.",
          },
          {
            question:
              "What is the difference between container restartPolicy: Always, OnFailure, and Never?",
            answer:
              "Always: restart regardless of exit code (typical for long-running apps). OnFailure: restart only on non-zero exit (jobs/batch). Never: never restart (one-time tasks). Default is Always. Policy applies to all containers in the Pod.",
          },
          {
            question: "What is CrashLoopBackOff and how do you debug it?",
            answer:
              "Container repeatedly crashes and restarts with exponential backoff delay. Debug: kubectl logs pod-name, kubectl logs pod-name --previous (previous crash), kubectl describe pod (events), check application errors, verify image, check resource limits, liveness/readiness probes.",
          },
          {
            question:
              "What are Init Containers and how do they differ from regular containers?",
            answer:
              "Init containers run before app containers, run to completion sequentially, must succeed before app starts. Uses: wait for services, setup/config, security checks. Regular containers run in parallel continuously. Init containers don't support liveness/readiness probes.",
          },
          {
            question:
              "How do containers in the same Pod communicate with each other?",
            answer:
              "Via localhost since they share network namespace. Example: container A on port 8080, container B can reach it at localhost:8080. They also share volumes for file-based communication. No service needed for intra-pod communication.",
          },
          {
            question:
              "What is the difference between resource requests and limits?",
            answer:
              "Requests: guaranteed resources, used for scheduling decisions (node must have this available). Limits: maximum allowed, container throttled (CPU) or killed (memory) if exceeded. QoS classes: Guaranteed (requests=limits), Burstable (has limits), BestEffort (no requests/limits).",
          },
          {
            question: "What happens if a Pod exceeds its memory limit?",
            answer:
              "Pod is OOMKilled (Out Of Memory). Container restarts based on restartPolicy. kubectl describe pod shows OOMKilled in last state. kubectl get events shows memory exceeded. Solution: increase memory limit, optimize app, check for memory leaks.",
          },
          {
            question:
              "Predict output: kubectl get pod mypod -o jsonpath='{.status.phase}'",
            answer:
              "Returns pod phase as string: Pending, Running, Succeeded, Failed, or Unknown. Useful for scripting and automation to check pod state programmatically.",
          },
          {
            question:
              "What is the sidecar pattern and give a real-world example?",
            answer:
              "Sidecar: additional container that enhances/extends main app container. Example: logging sidecar (Fluentd) reads app logs from shared volume and forwards to centralized logging. Other examples: service mesh proxy (Envoy/Istio), monitoring agent, config reloader.",
          },
        ],
        exercises: [
          {
            type: "output",
            question:
              "Pod has 2 containers. First exits with code 0, second with code 1. What is Pod phase?",
            answer:
              "Failed - if ANY container fails, Pod phase is Failed (unless restartPolicy causes restart).",
          },
          {
            type: "command",
            question: "Get only pod names in current namespace",
            answer:
              "kubectl get pods -o custom-columns=NAME:.metadata.name --no-headers",
          },
          {
            type: "debug",
            question:
              "Pod stuck in ImagePullBackOff. What are the top 3 causes?",
            answer:
              "1) Image doesn't exist or wrong tag 2) No access to private registry (imagePullSecrets missing) 3) Network issues reaching registry. Check: kubectl describe pod, verify image name/tag, check registry credentials.",
          },
          {
            type: "scenario",
            question:
              "Create pod that runs busybox, sleeps 3600s, with 100Mi memory limit",
            answer:
              "kubectl run busybox --image=busybox --restart=Never --limits=memory=100Mi -- sleep 3600",
          },
          {
            type: "tricky",
            question: "Can two containers in same Pod bind to the same port?",
            answer:
              "No! They share network namespace. Port conflict occurs. Use different ports or listen on different interfaces.",
          },
          {
            type: "output",
            question: "kubectl logs mypod with 3 containers. What happens?",
            answer:
              "Error: Must specify container with -c flag when pod has multiple containers. Example: kubectl logs mypod -c container-name",
          },
          {
            type: "troubleshoot",
            question: "Pod Running but app not accessible. How to investigate?",
            answer:
              "1) kubectl exec -it pod -- curl localhost:port (test from inside) 2) Check service selector 3) Check readiness probe 4) kubectl logs 5) kubectl describe pod (events) 6) Verify exposed ports",
          },
          {
            type: "command",
            question: "View previous crashed container's logs",
            answer: "kubectl logs pod-name -c container-name --previous",
          },
          {
            type: "scenario",
            question:
              "Pod needs to wait for database to be ready before starting. How?",
            answer:
              "Use init container that checks DB connectivity (e.g., nc -z db-host 5432 or curl). Only starts app containers when init succeeds.",
          },
          {
            type: "tricky",
            question:
              "Predict: Pod has restartPolicy: OnFailure. Container exits with code 0. Does it restart?",
            answer:
              "No. OnFailure only restarts on non-zero exit code. Exit code 0 = success, no restart. Pod phase becomes Succeeded.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create pod with 2 nginx containers, delete it imperatively",
            code: "# This is tricky - can't have 2 containers with same name\nkubectl run pod1 --image=nginx --dry-run=client -o yaml > pod.yaml\n# Edit yaml to add second container\nkubectl apply -f pod.yaml\nkubectl delete pod pod1 --force --grace-period=0",
            output: "Pod created with 2 containers, immediately deleted",
          },
          {
            type: "program",
            question:
              "Program 2: Multi-container pod - app on 8080, sidecar logger accessing shared volume",
            code: 'apiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: app-logger\\nspec:\\n  volumes:\\n  - name: shared-logs\\n    emptyDir: {}\\n  containers:\\n  - name: app\\n    image: busybox\\n    command: [\"sh\", \"-c\", \"while true; do echo $(date) >> /logs/app.log; sleep 5; done\"]\\n    volumeMounts:\\n    - name: shared-logs\\n      mountPath: /logs\\n  - name: logger\\n    image: busybox\\n    command: [\"sh\", \"-c\", \"tail -f /logs/app.log\"]\\n    volumeMounts:\\n    - name: shared-logs\\n      mountPath: /logs',
            output:
              "App writes logs, sidecar reads and displays them continuously",
          },
          {
            type: "program",
            question:
              "Program 3: Pod with init container that waits for service to be available",
            code: "apiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: myapp\\nspec:\\n  initContainers:\\n  - name: wait-for-db\\n    image: busybox\\n    command: ['sh', '-c', 'until nslookup db-service; do echo waiting for db; sleep 2; done']\\n  containers:\\n  - name: app\\n    image: nginx",
            output: "Init waits for db-service DNS, then app container starts",
          },
          {
            type: "program",
            question:
              "Program 4: Create pod, check its IP, exec into it and curl itself",
            code: "kubectl run testpod --image=nginx\\nPOD_IP=$(kubectl get pod testpod -o jsonpath='{.status.podIP}')\\necho $POD_IP\\nkubectl exec testpod -- curl -s localhost:80",
            output:
              "Shows pod IP (e.g., 10.244.1.5), nginx welcome page from curl",
          },
          {
            type: "program",
            question: "Program 5: Trigger OOMKilled by exceeding memory limit",
            code: "kubectl run oom-test --image=progrium/stress --limits=memory=50Mi -- --vm 1 --vm-bytes 100M\\nkubectl wait --for=condition=Ready pod/oom-test --timeout=30s\\nkubectl get pod oom-test\\nkubectl describe pod oom-test | grep -A 5 'Last State'",
            output:
              "Pod shows OOMKilled, restarts repeatedly (CrashLoopBackOff)",
          },
          {
            type: "program",
            question:
              "Program 6: Extract all container names from a multi-container pod",
            code: "kubectl get pod multi-pod -o jsonpath='{.spec.containers[*].name}'",
            output: "app sidecar init-container (space-separated list)",
          },
          {
            type: "program",
            question:
              "Program 7: Pod that exits successfully, verify Succeeded phase",
            code: "kubectl run success-pod --image=busybox --restart=Never -- sh -c 'echo success && exit 0'\\nsleep 5\\nkubectl get pod success-pod -o jsonpath='{.status.phase}'",
            output: "Succeeded",
          },
        ],
      },
      {
        id: "deployments",
        title: "Deployments",
        category: "Workload Controllers",
        description:
          "Manage replica sets and provide declarative updates for pods.",
        explanation:
          "Deployments are the declarative way to manage stateless applications in Kubernetes. They provide rolling updates, rollbacks, scaling, and self-healing by managing ReplicaSets. Understanding deployment strategies (RollingUpdate, Recreate), rollout mechanics, and troubleshooting failed deployments is critical for production operations.\\n\\nInterview focus:\\n- Deployment vs ReplicaSet vs Pod relationship\\n- Rolling update strategy (maxSurge, maxUnavailable)\\n- Recreate strategy and when to use it\\n- Rollout history and revision management\\n- Rollback mechanisms and commands\\n- Update triggers (image, env, resources, etc.)\\n- Deployment status conditions (Progressing, Available, Failed)\\n- Readiness and liveness probes impact on rollouts",
        code: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80`,
        command: `# Create deployment
kubectl apply -f deployment.yaml

# List deployments
kubectl get deployments

# Scale deployment
kubectl scale deployment nginx-deployment --replicas=5

# Update image
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# Rollout status
kubectl rollout status deployment/nginx-deployment

# Rollout history
kubectl rollout history deployment/nginx-deployment

# Rollback deployment
kubectl rollout undo deployment/nginx-deployment

# Delete deployment
kubectl delete deployment nginx-deployment`,
        example: `# Deployment with rolling update strategy
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:v2
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`,
        useCase: "Application deployment, scaling, rolling updates, rollbacks",
        interviewQuestions: [
          {
            question:
              "What is the relationship between Deployment, ReplicaSet, and Pod?",
            answer:
              "Deployment creates and manages ReplicaSets, ReplicaSet creates and manages Pods. Deployment is declarative config, ReplicaSet ensures desired replica count, Pods run containers. Each update creates new ReplicaSet (old ones kept for rollback). Deployment → ReplicaSet → Pods.",
          },
          {
            question:
              "Explain maxSurge and maxUnavailable in RollingUpdate strategy.",
            answer:
              "maxSurge: max additional pods above desired count during update (can be number or %). maxUnavailable: max pods that can be unavailable during update. Example: replicas=10, maxSurge=2, maxUnavailable=1 → can have 12 pods max, 9 pods min during roll out. Balances speed vs resource usage.",
          },
          {
            question:
              "When would you use Recreate strategy instead of RollingUpdate?",
            answer:
              "Recreate: kill all old pods, then create new ones. Use when: 1) Can't run old+new versions together (database migration, shared state) 2) Limited resources 3) Don't need zero downtime. Causes downtime but simpler. RollingUpdate is default.",
          },
          {
            question:
              "How do you trigger a deployment rollout? What changes cause updates?",
            answer:
              "Triggers: image change, env vars, resource limits, volumes, command/args. NOT triggered by: ConfigMap/Secret changes (must change reference or pod template annotation). Use kubectl set image, kubectl edit, kubectl apply, or kubectl replace.",
          },
          {
            question:
              "Predict output: Deployment has revisionHistoryLimit: 5. After 10 updates, how many ReplicaSets exist?",
            answer:
              "6 ReplicaSets: current (1) + previous 5 (revisionHistoryLimit). Oldest RS deleted. Default is 10. Setting to 0 prevents rollback. Important for resource management in clusters with frequent deployments.",
          },
          {
            question:
              "How do you rollback a deployment? Can you rollback to specific revision?",
            answer:
              "Rollback to previous: kubectl rollout undo deployment/name. To specific revision: kubectl rollout undo deployment/name --to-revision=3. View history: kubectl rollout history deployment/name. See revision details: kubectl rollout history deployment/name --revision=3.",
          },
          {
            question:
              "What happens when you scale deployment while rollout is in progress?",
            answer:
              "Scale operation takes effect immediately on current replicaset. Rollout continues but adjusts to new desired count. E.g., rolling from 5→5 replicas with v1→v2, scale to 10: rollout continues with target of 10 pods at v2.",
          },
          {
            question:
              "Tricky: Deployment stuck with 2/3 replicas available. How to debug?",
            answer:
              "Check: 1) kubectl rollout status (shows progress) 2) kubectl describe deployment (events, conditions) 3) kubectl get rs (check replicasets) 4) kubectl describe rs (pod creation issues) 5) kubectl get pods (pod statuses) 6) Check readiness probes, image pull, resources, node capacity.",
          },
          {
            question:
              "What is progressDeadlineSeconds and what happens when exceeded?",
            answer:
              "Max time (default 600s) for deployment to progress. If deployment doesn't make progress (new pods not ready), it's marked as Failed condition. Rollout is NOT automatically rolled back - manual intervention needed. Use to detect stuck rollouts.",
          },
          {
            question:
              "Output question: kubectl set image deployment/app app=nginx:1.22 --record. What does --record do?",
            answer:
              "Records the command in rollout history (CHANGE-CAUSE field). Deprecated in v1.22, use kubectl annotate deployment/app kubernetes.io/change-cause='reason' instead. Helps track what changed in each revision.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create deployment nginx with 4 replicas imperatively",
            answer:
              "kubectl create deployment nginx --image=nginx --replicas=4",
          },
          {
            type: "command",
            question: "Scale deployment to 10 replicas",
            answer: "kubectl scale deployment nginx --replicas=10",
          },
          {
            type: "scenario",
            question:
              "Update deployment image to nginx:1.23, check rollout status",
            answer:
              "kubectl set image deployment/nginx nginx=nginx:1.23 && kubectl rollout status deployment/nginx",
          },
          {
            type: "debug",
            question:
              "Deployment shows 0/3 replicas ready. Where to look first?",
            answer:
              "kubectl describe deployment (events), kubectl get rs (replicaset status), kubectl get pods (pod statuses), kubectl describe pod (failing pod details)",
          },
          {
            type: "command",
            question: "Rollback deployment to previous version",
            answer: "kubectl rollout undo deployment/nginx",
          },
          {
            type: "output",
            question:
              "Predict: replicas=5, maxSurge=2, maxUnavailable=1. Maximum pods during rollout?",
            answer:
              "7 pods (5 desired + 2 surge). Minimum 4 pods (5 - 1 unavailable).",
          },
          {
            type: "tricky",
            question: "Can you delete a deployment but keep its pods running?",
            answer:
              "Yes! Use kubectl delete deployment name --cascade=orphan. Pods become orphaned (no owner). Useful for debugging or transitioning management.",
          },
          {
            type: "command",
            question: "View rollout history with change causes",
            answer: "kubectl rollout history deployment/nginx",
          },
          {
            type: "scenario",
            question: "Pause rollout midway, make multiple changes, resume",
            answer:
              "kubectl rollout pause deployment/nginx, kubectl set image..., kubectl set resources..., kubectl rollout resume deployment/nginx",
          },
          {
            type: "troubleshoot",
            question: "Deployment updated but pods still run old image. Why?",
            answer:
              "Check: 1) Image pull policy (IfNotPresent with same tag) 2) Image actually changed? kubectl describe deployment 3) Rollout stuck? kubectl rollout status 4) Node cache issue? Use specific image tags.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create deployment, scale it, check replica count at each step",
            code: "kubectl create deployment web --image=nginx --replicas=2\nkubectl get deployment web\nkubectl scale deployment web --replicas=5\nkubectl get deployment web -o jsonpath='{.spec.replicas}:{.status.availableReplicas}'",
            output: "2:2 initially, then 5:5 after scaling",
          },
          {
            type: "program",
            question:
              "Program 2: Update deployment, watch rollout, see ReplicaSets",
            code: "kubectl create deployment app --image=nginx:1.21 --replicas=3\nkubectl set image deployment/app nginx=nginx:1.22\nkubectl rollout status deployment/app\nkubectl get rs -l app=app",
            output:
              "Shows 2 ReplicaSets: old (0 replicas) and new (3 replicas)",
          },
          {
            type: "program",
            question:
              "Program 3: Create deployment with wrong image, observe failure, rollback",
            code: "kubectl create deployment bad --image=nginx:1.22 --replicas=3\nkubectl set image deployment/bad nginx=nginx:nonexistent\nkubectl rollout status deployment/bad --timeout=30s\nkubectl get pods -l app=bad\nkubectl rollout undo deployment/bad\nkubectl rollout status deployment/bad",
            output:
              "New pods ImagePullBackOff, rollback succeeds, old version restored",
          },
          {
            type: "program",
            question:
              "Program 4: Extract revision history and rollback to specific revision",
            code: "kubectl create deployment ver --image=nginx:1.19\nkubectl set image deployment/ver nginx=nginx:1.20\nkubectl set image deployment/ver nginx=nginx:1.21\nkubectl rollout history deployment/ver\nkubectl rollout undo deployment/ver --to-revision=1\nkubectl get deployment ver -o jsonpath='{.spec.template.spec.containers[0].image}'",
            output: "Shows history with 3 revisions, final image is nginx:1.19",
          },
          {
            type: "program",
            question: "Program 5: Test maxSurge and maxUnavailable behavior",
            code: 'kubectl create deployment surge --image=nginx:1.21 --replicas=4\nkubectl patch deployment surge -p \'{"spec":{"strategy":{"rollingUpdate":{"maxSurge":2,"maxUnavailable":1}}}}\'\nkubectl set image deployment/surge nginx=nginx:1.22\nwhile true; do kubectl get pods -l app=surge --no-headers | wc -l; sleep 1; done',
            output:
              "During rollout, pod count varies: 4-6 pods (4 desired, +2 surge, -1 unavailable)",
          },
          {
            type: "program",
            question:
              "Program 6: Pause deployment, make changes, resume and observe single rollout",
            code: "kubectl create deployment pause-test --image=nginx:1.21\nkubectl rollout pause deployment/pause-test\nkubectl set image deployment/pause-test nginx=nginx:1.22\nkubectl set resources deployment/pause-test -c=nginx --limits=cpu=200m\nkubectl rollout resume deployment/pause-test\nkubectl rollout status deployment/pause-test\nkubectl rollout history deployment/pause-test",
            output: "Only 1 new revision created despite 2 changes",
          },
          {
            type: "program",
            question:
              "Program 7: Delete deployment keeping pods, verify orphaned pods",
            code: "kubectl create deployment orphan --image=nginx --replicas=3\nkubectl delete deployment orphan --cascade=orphan\nkubectl get pods -l app=orphan\nkubectl get deployment orphan",
            output:
              "Deployment deleted, pods still running (no owner reference)",
          },
        ],
      },
      {
        id: "services",
        title: "Services",
        category: "Networking",
        description:
          "Expose pods to network traffic with stable endpoints and load balancing.",
        explanation:
          "Services provide stable networking endpoints for ephemeral Pods, enabling service discovery and load balancing. Understanding service types (ClusterIP, NodePort, LoadBalancer, ExternalName), endpoint management, and kube-proxy modes is essential for building distributed systems.\n\nInterview focus:\n- Service types and when to use each\n- Label selectors and endpoint selection\n- ClusterIP vs NodePort vs LoadBalancer\n- Headless services and StatefulSets\n- Session affinity and load balancing\n- DNS resolution (service-name.namespace.svc.cluster.local)\n- EndpointSlices vs Endpoints\n- kube-proxy modes (iptables, ipvs, userspace)",
        code: `# service.yaml - ClusterIP (internal)
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP

# service-loadbalancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-lb
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer`,
        command: `# Create service
kubectl apply -f service.yaml

# List services
kubectl get services
kubectl get svc

# Describe service
kubectl describe service nginx-service

# Get service endpoints
kubectl get endpoints nginx-service

# Delete service
kubectl delete service nginx-service

# Port forwarding for testing
kubectl port-forward service/nginx-service 8080:80`,
        example: `# NodePort service (external access)
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080

# Headless service (for StatefulSets)
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306`,
        useCase:
          "Service discovery, load balancing, exposing applications, networking",
        interviewQuestions: [
          {
            question: "Explain the 4 Service types and when to use each.",
            answer:
              "ClusterIP (default): internal cluster access only, for backend services. NodePort: exposes on each node's IP at static port (30000-32767), for development/testing. LoadBalancer: cloud provider LB, for production external access. ExternalName: maps to external DNS, for integrating external services.",
          },
          {
            question:
              "How does a Service discover Pods? What happens if Pod labels change?",
            answer:
              "Service uses selector to match Pod labels. Continuously watches for matching Pods, updates Endpoints automatically. If Pod labels change and no longer match, it's removed from Endpoints. If changed to match, it's added. Dynamic and real-time.",
          },
          {
            question: "What is a headless service and why use it?",
            answer:
              "Service with clusterIP: None. No load balancing, DNS returns all Pod IPs instead of single VIP. Use for StatefulSets (stable network identity), client-side load balancing, peer discovery. Example: Cassandra, Kafka, databases needing direct pod access.",
          },
          {
            question:
              "Output: kubectl get svc mysvc shows CLUSTER-IP as <none>. What type is it?",
            answer:
              "Headless service (clusterIP: None). Used for StatefulSets or when clients need direct pod IPs. DNS returns A records for each pod instead of single ClusterIP.",
          },
          {
            question: "Explain port, targetPort, and nodePort in Service spec.",
            answer:
              "port: Service's exposed port (other pods use this). targetPort: Pod's container port (where traffic routes). nodePort: External port on nodes (30000-32767). Example: port:80, targetPort:8080 means service:80 → pod:8080.",
          },
          {
            question:
              "Service has selector app=web but no Endpoints. What are 3 possible reasons?",
            answer:
              "1) No Pods with label app=web exist 2) Pods exist but not Ready (readiness probe failing) 3) Pods in different namespace (service and pods must be in same namespace) 4) Typo in selector or labels.",
          },
          {
            question: "What is sessionAffinity and when would you use it?",
            answer:
              "Routes traffic from same client IP to same Pod. Values: None (default), ClientIP. Use for: stateful apps without shared storage, WebSocket connections, connection pooling. Only considers client IP, not cookies/headers.",
          },
          {
            question:
              "Tricky: Can a Service route to Pods in different namespaces?",
            answer:
              "No. Services only route to Pods in the same namespace. Workaround: use ExternalName service or manual Endpoints to point to service in another namespace.",
          },
          {
            question: "How do you access a service from another namespace?",
            answer:
              "Use FQDN: service-name.namespace.svc.cluster.local. Example: mysql.database.svc.cluster.local. Within same namespace, just service-name works. Cross-namespace requires full DNS name.",
          },
          {
            question:
              "What happens when LoadBalancer service is created in non-cloud environment?",
            answer:
              "Stays in Pending state with no external IP assigned. Cloud controller manager handles LB provisioning. On-prem: use MetalLB, NodePort, or Ingress. kubectl get svc shows <pending> under EXTERNAL-IP.",
          },
        ],
        exercises: [
          {
            type: "command",
            question:
              "Create ClusterIP service exposing Pod on port 8080 imperatively",
            answer: "kubectl expose pod mypod --port=8080 --name=mysvc",
          },
          {
            type: "output",
            question:
              "Service YAML has port:80, targetPort:8080. If you curl service:80, where does traffic go?",
            answer:
              "Pod's container on port 8080. Service port 80 maps to pod container port 8080.",
          },
          {
            type: "scenario",
            question:
              "Expose deployment with 3 replicas using NodePort on port 30001",
            answer:
              "kubectl expose deployment myapp --type=NodePort --port=80 --target-port=8080 --node-port=30001",
          },
          {
            type: "debug",
            question: "Service created but can't reach pods. How to debug?",
            answer:
              "1) kubectl get endpoints servicename (check if populated) 2) kubectl get pods --show-labels (verify labels match selector) 3) kubectl describe pod (check readiness) 4) Test pod directly: kubectl exec",
          },
          {
            type: "tricky",
            question: "Can two services select the same pods?",
            answer:
              "Yes! Multiple services can select same pods with same labels. Use for: different ports, internal vs external access, canary routing with different selectors.",
          },
          {
            type: "command",
            question: "Get DNS name for service mysql in namespace production",
            answer: "mysql.production.svc.cluster.local",
          },
          {
            type: "scenario",
            question: "Create headless service for StatefulSet",
            answer:
              "kubectl create service clusterip myapp --tcp=80:80 --clusterip=None",
          },
          {
            type: "output",
            question: "NodePort range in Kubernetes defaults?",
            answer:
              "30000-32767. Can configure apiserver --service-node-port-range flag to change.",
          },
          {
            type: "troubleshoot",
            question:
              "LoadBalancer service external IP shows <pending> for 10 minutes. Why?",
            answer:
              "Not in cloud environment or cloud controller not configured. Check: kubectl get events, cloud provider integration, use NodePort or Ingress instead.",
          },
          {
            type: "command",
            question: "Port forward local 8080 to service port 80",
            answer: "kubectl port-forward svc/myservice 8080:80",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create deployment, expose as ClusterIP, test from another pod",
            code: "kubectl create deployment web --image=nginx --replicas=2\nkubectl expose deployment web --port=80\nkubectl run test --image=busybox --rm -it -- wget -qO- web:80",
            output:
              "Nginx welcome page HTML returned from service load-balanced across 2 pods",
          },
          {
            type: "program",
            question:
              "Program 2: Verify service selects pods by checking endpoints",
            code: "kubectl create deployment app --image=nginx --replicas=3\nkubectl expose deployment app --port=80\nkubectl get endpoints app -o yaml\nkubectl get pods -l app=app -o wide",
            output:
              "Endpoints show 3 pod IPs matching the 3 pod IPs from get pods",
          },
          {
            type: "program",
            question:
              "Program 3: Create NodePort service, access from outside cluster",
            code: "kubectl create deployment np --image=nginx\nkubectl expose deployment np --type=NodePort --port=80\nNODE_PORT=$(kubectl get svc np -o jsonpath='{.spec.ports[0].nodePort}')\nNODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}')\ncurl http://$NODE_IP:$NODE_PORT",
            output: "Nginx welcome page accessible via node IP and NodePort",
          },
          {
            type: "program",
            question: "Program 4: Test headless service returning all pod IPs",
            code: "kubectl create deployment hl --image=nginx --replicas=3\nkubectl expose deployment hl --port=80 --cluster-ip=None\nkubectl run test --image=busybox --rm -it -- nslookup hl",
            output:
              "DNS returns 3 A records with individual pod IPs, not single ClusterIP",
          },
          {
            type: "program",
            question:
              "Program 5: Service with no matching pods has empty endpoints",
            code: "kubectl create service clusterip orphan --tcp=80:80\nkubectl get endpoints orphan\nkubectl get svc orphan",
            output:
              "Service exists but endpoints show <none> (no matching pods)",
          },
          {
            type: "program",
            question:
              "Program 6: Test cross-namespace service access with FQDN",
            code: "kubectl create namespace ns1\nkubectl create namespace ns2\nkubectl create deployment web -n ns1 --image=nginx\nkubectl expose deployment web -n ns1 --port=80\nkubectl run test -n ns2 --image=busybox --rm -it -- wget -qO- web.ns1.svc.cluster.local:80",
            output: "Pod in ns2 successfully reaches service in ns1 using FQDN",
          },
          {
            type: "program",
            question:
              "Program 7: Session affinity routes same client to same pod",
            code: 'kubectl create deployment sticky --image=nginx --replicas=3\nkubectl expose deployment sticky --port=80\nkubectl patch svc sticky -p \'{"spec":{"sessionAffinity":"ClientIP"}}\'\nfor i in {1..5}; do kubectl run test-$i --image=busybox --rm --restart=Never -- wget -qO- sticky:80; done',
            output:
              "Same client IP consistently routed to same pod (check pod names in logs)",
          },
        ],
      },
      {
        id: "namespaces",
        title: "Namespaces",
        category: "Resource Organization",
        description: "Virtual clusters for organizing and isolating resources.",
        explanation:
          "Namespaces provide logical isolation and resource organization within a cluster. They enable multi-tenancy, resource quotas, network policies, and RBAC. Understanding namespace scope, default namespaces, and cross-namespace communication is key for cluster management.\n\nInterview focus:\n- Default namespaces (default, kube-system, kube-public, kube-node-lease)\n- Namespace-scoped vs cluster-scoped resources\n- ResourceQuotas and LimitRanges\n- Cross-namespace communication\n- Namespace deletion and cascading deletion\n- Context and namespace management in kubectl\n- Network policies and namespace isolation",
        code: `# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
  labels:
    environment: development`,
        command: `# Create namespace
kubectl create namespace dev
kubectl apply -f namespace.yaml

# List namespaces
kubectl get namespaces
kubectl get ns

# Get resources in namespace
kubectl get pods -n dev
kubectl get all -n dev

# Set default namespace for context
kubectl config set-context --current --namespace=dev

# Delete namespace (deletes all resources)
kubectl delete namespace dev

# Describe namespace
kubectl describe namespace dev`,
        example: `# Deploy to specific namespace
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest

# Create resources in namespace
kubectl apply -f deployment.yaml -n dev
kubectl create deployment nginx --image=nginx -n production`,
        useCase:
          "Multi-tenancy, environment separation, resource isolation, organization",
        interviewQuestions: [
          {
            question:
              "What are the 4 default namespaces in Kubernetes and their purposes?",
            answer:
              "default: objects with no namespace specified. kube-system: system pods (kube-dns, metrics-server). kube-public: publicly readable, reserved for cluster usage. kube-node-lease: node heartbeat leases for node health detection.",
          },
          {
            question: "Which resources are namespace-scoped vs cluster-scoped?",
            answer:
              "Namespace-scoped: Pods, Services, Deployments, ConfigMaps, Secrets, PVCs. Cluster-scoped: Nodes, PersistentVolumes, StorageClasses, Namespaces, ClusterRoles. Use kubectl api-resources --namespaced=true/false to list.",
          },
          {
            question: "What happens when you delete a namespace?",
            answer:
              "Cascading deletion: all resources in namespace deleted (Pods, Services, Deployments, etc). PersistentVolumes survive (cluster-scoped). Operation can take time if pods have finalizers. Use --grace-period=0 --force cautiously.",
          },
          {
            question:
              "Tricky: Two pods in different namespaces have same name. Can they coexist?",
            answer:
              "Yes. Names must be unique within a namespace, not cluster-wide. dev/mypod and prod/mypod are different resources.",
          },
          {
            question:
              "Output: kubectl config set-context --current --namespace=production. What changes?",
            answer:
              "It sets the default namespace for the current context to production. Commands without -n use production.",
          },
          {
            question: "How do you prevent resource exhaustion in a namespace?",
            answer:
              "Use ResourceQuota (namespace totals) and LimitRange (per-pod/container defaults and limits).",
          },
          {
            question: "Can pods in namespace A access services in namespace B?",
            answer:
              "Yes, using FQDN like service-name.namespace-b.svc.cluster.local unless NetworkPolicy restricts traffic.",
          },
          {
            question:
              "Predict: kubectl get pods without -n flag. Which namespace is queried?",
            answer: "Current context namespace; if unset, default namespace.",
          },
          {
            question:
              "What is the label selector for namespace isolation in NetworkPolicy?",
            answer:
              "Use namespaceSelector with matchLabels (for example env=prod).",
          },
          {
            question: "Tricky: Can you create a pod named 'kube-system'?",
            answer:
              "Yes. That's just a pod name. The reserved namespace kube-system is a different resource type.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create namespace named staging",
            answer: "kubectl create namespace staging",
          },
          {
            type: "scenario",
            question: "Deploy nginx in production namespace imperatively",
            answer:
              "kubectl create deployment nginx --image=nginx -n production",
          },
          {
            type: "command",
            question: "Get all pods across all namespaces",
            answer: "kubectl get pods --all-namespaces or kubectl get pods -A",
          },
          {
            type: "output",
            question:
              "kubectl delete ns test. What happens to pods in test namespace?",
            answer:
              "All namespaced resources in test are deleted by cascading deletion.",
          },
          {
            type: "command",
            question:
              "Set default namespace to development for current context",
            answer:
              "kubectl config set-context --current --namespace=development",
          },
          {
            type: "debug",
            question:
              "kubectl get pods returns empty but pods exist. What's wrong?",
            answer:
              "You are likely querying the wrong namespace; use -A or set correct context namespace.",
          },
          {
            type: "scenario",
            question: "Create ResourceQuota limiting namespace to 10 pods max",
            answer: "kubectl create quota pod-limit --hard=pods=10 -n myns",
          },
          {
            type: "command",
            question: "List only namespace names (no headers)",
            answer:
              "kubectl get ns -o custom-columns=NAME:.metadata.name --no-headers",
          },
          {
            type: "tricky",
            question: "Can you create a namespace named 'default'?",
            answer: "No, it already exists and namespace names must be unique.",
          },
          {
            type: "troubleshoot",
            question:
              "Namespace deletion stuck in Terminating state. How to force?",
            answer:
              "Find blocking finalizers and remove them carefully. Last resort: patch finalizers to null.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create namespace, deploy pod, verify isolation from default",
            code: "kubectl create namespace isolated\nkubectl run pod1 -n isolated --image=nginx\nkubectl run pod2 --image=nginx\nkubectl get pods -n isolated\nkubectl get pods",
            output:
              "pod1 only visible in isolated namespace, pod2 only in default",
          },
          {
            type: "program",
            question: "Program 2: Test cross-namespace service access",
            code: "kubectl create namespace ns1\nkubectl create namespace ns2\nkubectl create deployment web -n ns1 --image=nginx\nkubectl expose deployment web -n ns1 --port=80\nkubectl run test -n ns2 --image=busybox --rm -it -- wget -qO- web.ns1.svc.cluster.local",
            output: "Pod in ns2 successfully accesses service in ns1 via FQDN",
          },
          {
            type: "program",
            question:
              "Program 3: Create ResourceQuota, exceed it, observe rejection",
            code: "kubectl create namespace limited\nkubectl create quota limit --hard=pods=2 -n limited\nkubectl run pod1 -n limited --image=nginx\nkubectl run pod2 -n limited --image=nginx\nkubectl run pod3 -n limited --image=nginx\nkubectl get pods -n limited",
            output: "pod1 and pod2 created, pod3 fails with quota error",
          },
          {
            type: "program",
            question: "Program 4: Switch default namespace in context, verify",
            code: "kubectl config set-context --current --namespace=kube-system\nkubectl get pods\nkubectl config view --minify | grep namespace",
            output:
              "Shows kube-system pods, confirms namespace in current context",
          },
          {
            type: "program",
            question:
              "Program 5: Delete namespace and verify cascading deletion",
            code: "kubectl create namespace temp\nkubectl run pod1 -n temp --image=nginx\nkubectl create deployment dep1 -n temp --image=nginx\nkubectl delete namespace temp\nkubectl get all -n temp",
            output: "All resources deleted, namespace temp removed",
          },
          {
            type: "program",
            question: "Program 6: Count pods per namespace",
            code: "kubectl get pods -A --no-headers | awk '{print $1}' | sort | uniq -c",
            output: "Lists each namespace with pod count",
          },
          {
            type: "program",
            question: "Program 7: Label namespace and select by label",
            code: "kubectl create namespace env-prod\nkubectl label namespace env-prod environment=production\nkubectl get namespaces -l environment=production",
            output:
              "env-prod namespace listed with environment=production label",
          },
        ],
      },
    ],
  },
  {
    category: "Configuration & Storage",
    topics: [
      {
        id: "configmaps",
        title: "ConfigMaps",
        description:
          "Store non-confidential configuration data as key-value pairs.",
        code: `# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432/mydb"
  log_level: "info"
  app.properties: |
    app.name=MyApp
    app.version=1.0
    app.port=8080`,
        command: `# Create ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Create from literal values
kubectl create configmap app-config \\
  --from-literal=database_url=postgres://db:5432 \\
  --from-literal=log_level=info

# Get ConfigMaps
kubectl get configmaps
kubectl get cm

# Describe ConfigMap
kubectl describe configmap app-config

# View ConfigMap data
kubectl get configmap app-config -o yaml

# Delete ConfigMap
kubectl delete configmap app-config`,
        example: `# Use ConfigMap as environment variables
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: app
    image: myapp:latest
    envFrom:
    - configMapRef:
        name: app-config

# Use specific keys from ConfigMap
env:
- name: DATABASE_URL
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: database_url

# Mount ConfigMap as volume
volumes:
- name: config
  configMap:
    name: app-config
volumeMounts:
- name: config
  mountPath: /etc/config`,
        useCase:
          "Application configuration, environment-specific settings, feature flags",
        interviewQuestions: [
          {
            question: "What is the difference between ConfigMap and Secret?",
            answer:
              "ConfigMap: non-sensitive config data, stored plain text. Secret: sensitive data, base64 encoded (not encrypted!), needs RBAC protection. Both: 1MB limit, consumed same way (env/volume). Use Secret for passwords, ConfigMap for app settings.",
          },
          {
            question:
              "Tricky: You update ConfigMap used by running pod. Does pod see new values?",
            answer:
              "Depends on consumption method. Env vars: NO (pod needs restart). Volume mount: YES (after sync delay ~60s). Use envFrom with configMapRef for env – manual pod restart or rolling update needed.",
          },
          {
            question:
              "Output: kubectl create configmap myconf --from-file=app.properties. What is the key name?",
            answer:
              "Key name is 'app.properties' (filename). Access as configMapKeyRef: {name: myconf, key: app.properties}. Use --from-file=customkey=app.properties to set custom key name.",
          },
          {
            question:
              "What happens if ConfigMap referenced in pod doesn't exist?",
            answer:
              "Pod stuck in Pending/CreateContainerConfigError. Use optional: true in configMapKeyRef to make it optional. Pod will start without it. Check: kubectl describe pod shows event missing ConfigMap.",
          },
          {
            question:
              "How do you create ConfigMap from multiple files in directory?",
            answer:
              "kubectl create configmap myconf --from-file=./config-dir/ creates keys for each file. Or --from-env-file for KEY=VALUE format. Each file becomes separate key in ConfigMap.",
          },
          {
            question:
              "Predict: ConfigMap has key 'log-level'. How to use as env var LOG_LEVEL?",
            answer:
              "env:\\n- name: LOG_LEVEL\\n  valueFrom:\\n    configMapKeyRef:\\n      name: myconfig\\n      key: log-level\\nNote: key can have hyphens, env var name typically underscores.",
          },
          {
            question: "What is an immutable ConfigMap and why use it?",
            answer:
              "immutable: true prevents changes, provides performance benefits (apiserver doesn't watch), protects production config. Once set, cannot modify – must delete and recreate. Available from K8s v1.19.",
          },
          {
            question:
              "Tricky: Can ConfigMap be in namespace A and pod in namespace B?",
            answer:
              "No! ConfigMap and Pod must be in same namespace. Cross-namespace referencing not allowed. Duplicate ConfigMap in each namespace or use external config management.",
          },
          {
            question:
              "What's the size limit for ConfigMap and what happens if exceeded?",
            answer:
              "1MB limit. kubectl create fails with 'request entity too large'. Split into multiple ConfigMaps or use external config store (etcd, Consul, cloud secret managers). etcd has 1MB object limit.",
          },
          {
            question:
              "How do you update all pods using ConfigMap after config change?",
            answer:
              "If using env: manual restart or rolling update (kubectl rollout restart deployment). If using volume: auto-updates after ~60s. Or: use config hash in deployment annotation to trigger auto-rollout.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create ConfigMap from literal app=myapp version=1.0",
            answer:
              "kubectl create configmap appconf --from-literal=app=myapp --from-literal=version=1.0",
          },
          {
            type: "scenario",
            question: "Create ConfigMap from file config.json and verify data",
            answer:
              "kubectl create configmap fileconf --from-file=config.json && kubectl get cm fileconf -o yaml",
          },
          {
            type: "output",
            question:
              "ConfigMap mounted as volume updates. How long for pods to see new values?",
            answer:
              "~60 seconds (configmap sync period). Can configure with --sync-frequency flag on kubelet.",
          },
          {
            type: "debug",
            question: "Pod shows CreateContainerConfigError. Where to check?",
            answer:
              "kubectl describe pod (Events section shows missing ConfigMap/Secret). Verify ConfigMap exists: kubectl get cm. Check namespace matches.",
          },
          {
            type: "tricky",
            question: "Can you base64 encode data in ConfigMap like Secret?",
            answer:
              "Yes, manually encode but not automatic. ConfigMap stores whatever you give it. However, no special handling – just plain text storage.",
          },
          {
            type: "command",
            question: "Extract value of key 'database' from ConfigMap 'dbconf'",
            answer:
              "kubectl get configmap dbconf -o jsonpath='{.data.database}'",
          },
          {
            type: "scenario",
            question: "Create immutable ConfigMap",
            answer:
              "Add immutable: true in spec when creating. Or: kubectl create configmap myconf --from-literal=key=value --dry-run=client -o yaml | sed 's/metadata:/&\\n  immutable: true/' | kubectl apply -f -",
          },
          {
            type: "troubleshoot",
            question:
              "ConfigMap changed but pod still using old values (env vars). Fix?",
            answer:
              "Env vars don't auto-update. Solution: kubectl rollout restart deployment/myapp to recreate pods with new values.",
          },
          {
            type: "command",
            question: "Create ConfigMap from all files in directory ./configs/",
            answer: "kubectl create configmap dirconf --from-file=./configs/",
          },
          {
            type: "output",
            question:
              "kubectl create cm test --from-literal=KEY=value. What is stored in etcd?",
            answer:
              "Plain text 'value'. ConfigMaps are NOT encrypted in etcd by default. Need encryption at rest configuration for security.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Create ConfigMap, use as env vars in pod",
            code: "kubectl create configmap app-env --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=debug\\nkubectl run testpod --image=busybox --restart=Never --dry-run=client -o yaml > pod.yaml\\n# Edit pod.yaml to add envFrom configMapRef\\nkubectl apply -f pod.yaml\\nkubectl exec testpod -- env | grep -E 'APP_ENV|LOG_LEVEL'",
            output: "APP_ENV=production\\nLOG_LEVEL=debug",
          },
          {
            type: "program",
            question:
              "Program 2: Mount ConfigMap as volume, verify file contents",
            code: "kubectl create configmap vol-config --from-literal=config.txt='Hello from ConfigMap'\\nkubectl run volpod --image=nginx --dry-run=client -o yaml > volpod.yaml\\n# Edit to add volume mount\\nkubectl apply -f volpod.yaml\\nkubectl exec volpod -- cat /etc/config/config.txt",
            output: "Hello from ConfigMap",
          },
          {
            type: "program",
            question:
              "Program 3: Create from file, update it, observe volume mount change",
            code: "echo 'version=1.0' > app.conf\\nkubectl create configmap appconf --from-file=app.conf\\nkubectl run app --image=nginx --dry-run=client -o yaml > app.yaml\\n# Add volume mount /etc/config\\nkubectl apply -f app.yaml\\nkubectl exec app -- cat /etc/config/app.conf\\n# Update\\necho 'version=2.0' > app.conf\\nkubectl create configmap appconf --from-file=app.conf --dry-run=client -o yaml | kubectl apply -f -\\nsleep 65\\nkubectl exec app -- cat /etc/config/app.conf",
            output: "version=1.0, then after 60s: version=2.0",
          },
          {
            type: "program",
            question:
              "Program 4: Test missing ConfigMap causes CreateContainerConfigError",
            code: "kubectl run badpod --image=nginx --dry-run=client -o yaml > bad.yaml\\n# Edit to reference non-existent configmap\\nkubectl apply -f bad.yaml\\nkubectl get pod badpod\\nkubectl describe pod badpod | grep Error",
            output:
              "Pod stuck, CreateContainerConfigError: configmap not found",
          },
          {
            type: "program",
            question:
              "Program 5: Create ConfigMap from directory with multiple files",
            code: "mkdir configs\\necho 'db=postgres' > configs/database.conf\\necho 'cache=redis' > configs/cache.conf\\nkubectl create configmap multiconf --from-file=configs/\\nkubectl get cm multiconf -o yaml",
            output: "Shows data with keys database.conf and cache.conf",
          },
          {
            type: "program",
            question: "Program 6: Extract all keys from ConfigMap",
            code: "kubectl create configmap sample --from-literal=key1=val1 --from-literal=key2=val2\\nkubectl get configmap sample -o jsonpath='{.data}' | jq 'keys'",
            output: '[\\"key1\\", \\"key2\\"]',
          },
          {
            type: "program",
            question:
              "Program 7: Test envFrom loads all keys as environment variables",
            code: "kubectl create configmap allenv --from-literal=DB_HOST=localhost --from-literal=DB_PORT=5432\\nkubectl run envpod --image=busybox --restart=Never --dry-run=client -o yaml > env.yaml\\n# Add envFrom with configMapRef\\nkubectl apply -f env.yaml\\nkubectl exec envpod -- env | grep DB_",
            output: "DB_HOST=localhost\\nDB_PORT=5432",
          },
        ],
      },
      {
        id: "secrets",
        title: "Secrets",
        description:
          "Store and manage sensitive information like passwords, tokens, and keys.",
        code: `# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded
  password: cGFzc3dvcmQxMjM=

# stringData for plain text (auto-encoded)
stringData:
  api-key: "my-secret-api-key"`,
        command: `# Create Secret from literals
kubectl create secret generic db-secret \\
  --from-literal=username=admin \\
  --from-literal=password=password123

# Create Secret from files
kubectl create secret generic tls-secret \\
  --from-file=tls.crt=cert.pem \\
  --from-file=tls.key=key.pem

# Get Secrets
kubectl get secrets

# Describe Secret (values hidden)
kubectl describe secret db-secret

# View Secret data (base64 encoded)
kubectl get secret db-secret -o yaml

# Decode secret
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 --decode

# Delete Secret
kubectl delete secret db-secret`,
        example: `# Use Secret as environment variables
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password

# Mount Secret as volume
volumes:
- name: secret-volume
  secret:
    secretName: db-secret
volumeMounts:
- name: secret-volume
  mountPath: /etc/secrets
  readOnly: true`,
        useCase: "Credentials, API keys, TLS certificates, passwords, tokens",
        interviewQuestions: [
          {
            question: "Are Secrets encrypted in Kubernetes by default?",
            answer:
              "No! Base64 encoded, NOT encrypted. Stored plain in etcd. Enable encryption at rest in apiserver --encryption-provider-config. Base64 is encoding (reversible), not encryption. Anyone with etcd access can decode.",
          },
          {
            question: "What are the Secret types and when to use each?",
            answer:
              "Opaque: generic key-value (default). kubernetes.io/tls: TLS cert/key. kubernetes.io/dockerconfigjson: Docker registry auth. kubernetes.io/basic-auth: username/password. kubernetes.io/ssh-auth: SSH keys. kubernetes.io/service-account-token: SA tokens.",
          },
          {
            question: "Tricky: Can you view Secret data with kubectl describe?",
            answer:
              "No! kubectl describe hides values for security. Use kubectl get secret mysecret -o yaml to see base64 data. Decode: echo <base64string> | base64 --decode. This prevents accidental exposure.",
          },
          {
            question:
              "Output: kubectl create secret generic test --from-literal=pass=admin123. How is 'admin123' stored?",
            answer:
              "Base64 encoded as 'YWRtaW4xMjM=' in etcd. Not encrypted unless encryption at rest enabled. Anyone with get secret permission can decode it.",
          },
          {
            question: "What is stringData vs data in Secret YAML?",
            answer:
              "stringData: plain text, auto-converted to base64. data: already base64 encoded. Use stringData for convenience (kubectl encodes it). stringData not stored – converted to data before storage. Read-only field.",
          },
          {
            question: "How do ImagePullSecrets work?",
            answer:
              "Stores Docker registry credentials. Created with kubectl create secret docker-registry. Referenced in pod spec imagePullSecrets. Allows pulling from private registries. Type: kubernetes.io/dockerconfigjson.",
          },
          {
            question:
              "Tricky: Secret in namespace A, Pod in namespace B. Will it work?",
            answer:
              "No! Like ConfigMap, Secret must be in same namespace as Pod. Cross-namespace not allowed. Duplicate secret in each namespace or use external secret management (Vault, cloud KMS).",
          },
          {
            question:
              "What is the 1MB limit on Secrets and how to handle larger data?",
            answer:
              "Secrets limited to 1MB (etcd constraint). For larger: use external secret stores (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault). Or mount as volume from external source. Or split into multiple secrets.",
          },
          {
            question:
              "Predict: Secret mounted as volume. What are file permissions?",
            answer:
              "0644 (rw-r--r--) by default. Can customize with defaultMode in volume spec. Example: 0400 (r--------) for read-only by owner. Secrets mounted read-only.",
          },
          {
            question: "What is an immutable Secret and security benefit?",
            answer:
              "immutable: true prevents modification. Benefits: protection from accidents, better performance (no watches), defense against attackers modifying secrets. Must delete/recreate to change. Available from K8s v1.21.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create generic secret with username and password",
            answer:
              "kubectl create secret generic creds --from-literal=username=admin --from-literal=password=secret123",
          },
          {
            type: "output",
            question: "Decode secret manually: data.password = 'cGFzc3dvcmQ='",
            answer: "echo 'cGFzc3dvcmQ=' | base64 --decode → password",
          },
          {
            type: "scenario",
            question: "Create TLS secret from cert.pem and key.pem files",
            answer:
              "kubectl create secret tls mytls --cert=cert.pem --key=key.pem",
          },
          {
            type: "command",
            question:
              "Create Docker registry secret for pulling private images",
            answer:
              "kubectl create secret docker-registry regcred --docker-server=myregistry.io --docker-username=user --docker-password=pass",
          },
          {
            type: "debug",
            question:
              "Pod shows ImagePullBackOff for private image. What to check?",
            answer:
              "1) imagePullSecrets referenced in pod spec 2) Secret exists: kubectl get secret 3) Credentials valid 4) Secret type is docker-registry 5) Secret in same namespace",
          },
          {
            type: "tricky",
            question: "Can you use kubectl edit to change Secret data?",
            answer:
              "Yes, but values must be base64 encoded! Edit shows base64. Or use stringData patch. Or delete and recreate. kubectl edit shows encoded data.",
          },
          {
            type: "command",
            question: "View decoded secret value for key 'apikey'",
            answer:
              "kubectl get secret mysecret -o jsonpath='{.data.apikey}' | base64 --decode",
          },
          {
            type: "scenario",
            question: "Mount secret as volume in pod at /etc/secrets read-only",
            answer:
              "Pod spec: volumes: [name: sec, secret: {secretName: mysec}], volumeMounts: [name: sec, mountPath: /etc/secrets, readOnly: true]",
          },
          {
            type: "troubleshoot",
            question: "Secret changed but pod uses old value (env var). Why?",
            answer:
              "Env vars don't auto-update from Secrets. Must restart pod. Use volume mount for auto-update (60s delay) or kubectl rollout restart deployment.",
          },
          {
            type: "output",
            question: "Create secret with stringData. What is stored in etcd?",
            answer:
              "Converted to base64 and stored in data field. stringData is convenience field, not persisted.",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create secret, use in pod as env vars, verify",
            code: "kubectl create secret generic dbsecret --from-literal=user=admin --from-literal=pass=secret\\nkubectl run dbpod --image=postgres --restart=Never --dry-run=client -o yaml > db.yaml\\n# Edit to add env from secretKeyRef\\nkubectl apply -f db.yaml\\nkubectl exec dbpod -- env | grep -E 'user|pass'",
            output: "user=admin\\npass=secret (environment variables)",
          },
          {
            type: "program",
            question: "Program 2: Mount secret as volume, verify file contents",
            code: "kubectl create secret generic filesec --from-literal=token=abc123\\nkubectl run secpod --image=nginx --dry-run=client -o yaml > sec.yaml\\n# Edit to add secret volume mount at /secrets\\nkubectl apply -f sec.yaml\\nkubectl exec secpod -- cat /secrets/token",
            output: "abc123",
          },
          {
            type: "program",
            question: "Program 3: Create TLS secret and verify type",
            code: "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj '/CN=test'\\nkubectl create secret tls testtls --cert=tls.crt --key=tls.key\\nkubectl get secret testtls -o jsonpath='{.type}'",
            output: "kubernetes.io/tls",
          },
          {
            type: "program",
            question: "Program 4: Decode secret programmatically",
            code: "kubectl create secret generic mysec --from-literal=password=mypass123\\nkubectl get secret mysec -o jsonpath='{.data.password}' | base64 --decode",
            output: "mypass123",
          },
          {
            type: "program",
            question: "Program 5: Test ImagePullSecret for private registry",
            code: "kubectl create secret docker-registry myreg --docker-server=docker.io --docker-username=user --docker-password=pass123\\nkubectl run private --image=user/privateimage:latest --dry-run=client -o yaml > priv.yaml\\n# Add imagePullSecrets: [{name: myreg}]\\nkubectl apply -f priv.yaml\\nkubectl describe pod private | grep 'pull image'",
            output: "Uses myreg secret to authenticate and pull image",
          },
          {
            type: "program",
            question: "Program 6: Create immutable secret",
            code: 'kubectl create secret generic immsec --from-literal=key=value --dry-run=client -o yaml | sed \'/metadata:/a\\  immutable: true\' | kubectl apply -f -\\nkubectl patch secret immsec -p \'{\\"data\\":{\\"key\\":\\"bmV3dmFsdWU=\\"}}\'',
            output: "Patch fails: field is immutable",
          },
          {
            type: "program",
            question:
              "Program 7: Compare Secret size limit - test 1MB boundary",
            code: "dd if=/dev/zero bs=1M count=1 | base64 > largefile.txt\\nkubectl create secret generic large --from-file=largefile.txt",
            output: "Error: Secret too large (exceeds 1MB etcd limit)",
          },
        ],
      },
      {
        id: "persistent-volumes",
        title: "Persistent Volumes & Claims",
        description:
          "Provide persistent storage to pods that survives pod restarts.",
        code: `# persistent-volume.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /mnt/data

# persistent-volume-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-data
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi`,
        command: `# Create PV and PVC
kubectl apply -f persistent-volume.yaml
kubectl apply -f persistent-volume-claim.yaml

# List PV and PVC
kubectl get pv
kubectl get pvc

# Describe PVC
kubectl describe pvc pvc-data

# Delete PVC (may not delete PV based on reclaim policy)
kubectl delete pvc pvc-data`,
        example: `# Use PVC in Pod
apiVersion: v1
kind: Pod
metadata:
  name: db-pod
spec:
  containers:
  - name: postgres
    image: postgres:15
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pvc-data

# Dynamic provisioning with StorageClass
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  storageClassName: fast-ssd
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi`,
        useCase:
          "Databases, file storage, stateful applications, data persistence",
        interviewQuestions: [
          {
            question: "What is the difference between PV and PVC?",
            answer:
              "PV (PersistentVolume): cluster resource provisioned by admin. PVC (PersistentVolumeClaim): request for storage by user/pod. PV is supply, PVC is demand. PVC binds to PV matching requirements (size, accessMode).",
          },
          {
            question:
              "What are PV access modes and which can be used together?",
            answer:
              "ReadWriteOnce (RWO): single node RW. ReadOnlyMany (ROX): multiple nodes RO. ReadWriteMany (RWX): multiple nodes RW. RWO most common, RWX needs NFS/cloud storage. Cannot mix RWO and RWX on same PV.",
          },
          {
            question: "Explain PV reclaim policies: Retain, Delete, Recycle",
            answer:
              "Retain: PV kept after PVC deleted, manual cleanup required. Delete: PV and storage deleted automatically (default for dynamic). Recycle: deprecated, basic scrub (rm -rf). Use Retain for production data safety.",
          },
          {
            question: "Tricky: PVC requests 5Gi, PV has 10Gi. Will it bind?",
            answer:
              "Yes! PVC requests minimum size. PV providing more is acceptable. PVC gets entire PV (10Gi available), but PVC shows requested 5Gi. Over-provisioning is fine.",
          },
          {
            question: "What is dynamic provisioning and StorageClass?",
            answer:
              "StorageClass enables dynamic PV creation. No manual PV needed. PVC specifies storageClassName, provisioner auto-creates PV. Example: AWS EBS, GCE PD, Azure Disk. Set as default: kubectl annotate storageclass <name> storageclass.kubernetes.io/is-default-class=true.",
          },
          {
            question:
              "Output: PVC stuck in Pending. What are possible reasons?",
            answer:
              "1) No PV matches size/accessMode/storageClass. 2) No StorageClass for dynamic provisioning. 3) StorageClass provisioner failed. 4) Insufficient capacity. 5) Access mode conflict. Check: kubectl describe pvc <name> for Events.",
          },
          {
            question: "What is volumeMode: Filesystem vs Block?",
            answer:
              "Filesystem (default): formatted, mounted as directory. Block: raw block device, no filesystem. Block for databases needing direct disk access (better performance). Must match between PV and PVC.",
          },
          {
            question: "Tricky: Pod deleted, PVC exists. Is data safe?",
            answer:
              "Yes! PVC lifecycle independent of Pod. Data persists even if Pod deleted. Only deleting PVC triggers reclaim policy. This is the point of PVCs – data outlives pods.",
          },
          {
            question:
              "What happens with RWO PVC when pod on different node uses it?",
            answer:
              "Pod stuck in ContainerCreating. RWO = single node. If pod scheduled to different node, volume can't attach. Must delete old pod first or use RWX. StatefulSets handle this with volumeClaimTemplates.",
          },
          {
            question:
              "Explain PV lifecycle states: Available, Bound, Released, Failed",
            answer:
              "Available: ready, no claim. Bound: bound to PVC. Released: PVC deleted but PV not reclaimed yet (Retain policy), needs manual cleanup. Failed: reclamation failed. kubectl get pv shows STATUS.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Create hostPath PV with 5Gi capacity, RWO mode",
            answer:
              "kubectl apply -f pv.yaml (spec: capacity.storage: 5Gi, accessModes: [ReadWriteOnce], hostPath: {path: /data})",
          },
          {
            type: "command",
            question: "Create PVC requesting 3Gi storage, RWO mode",
            answer:
              "kubectl apply -f pvc.yaml (spec: accessModes: [ReadWriteOnce], resources.requests.storage: 3Gi)",
          },
          {
            type: "debug",
            question: "PVC stuck in Pending for 5 minutes. How to diagnose?",
            answer:
              "kubectl describe pvc <name> → Check Events for errors. kubectl get pv → Check if matching PV exists. kubectl get storageclass → Verify StorageClass exists and provisioner running.",
          },
          {
            type: "scenario",
            question:
              "Pod needs persistent storage that survives node failure. Which accessMode?",
            answer:
              "ReadWriteMany (RWX) allows pod to be rescheduled to any node and access same volume. Or use cloud volumes that support cross-node attachment.",
          },
          {
            type: "troubleshoot",
            question: "PV deleted but storage still consuming disk space. Why?",
            answer:
              "Reclaim policy was 'Retain'. PV object deleted but actual storage remains. Manual cleanup: delete storage on backend (hostPath dir, cloud disk, etc).",
          },
          {
            type: "output",
            question:
              "PV bound to PVC. Delete PVC with Retain policy. What happens?",
            answer:
              "PV status changes from Bound to Released. PV not Available (bound to deleted PVC). Manual intervention: remove claimRef, then Available again.",
          },
          {
            type: "command",
            question:
              "Create StorageClass with provisioner kubernetes.io/no-provisioner",
            answer:
              "kubectl apply -f sc.yaml (kind: StorageClass, provisioner: kubernetes.io/no-provisioner, volumeBindingMode: WaitForFirstConsumer)",
          },
          {
            type: "scenario",
            question: "Mount PVC in pod at /data with subPath logs",
            answer:
              "Pod spec: volumeMounts: [name: storage, mountPath: /data, subPath: logs]. volumes: [name: storage, persistentVolumeClaim: {claimName: my-pvc}]",
          },
          {
            type: "tricky",
            question: "Two PVCs with same storageClassName. What happens?",
            answer:
              "Each PVC gets own dynamically provisioned PV. StorageClass creates separate PV for each claim. Not shared unless explicitly using same PV manually.",
          },
          {
            type: "command",
            question: "Expand PVC from 10Gi to 20Gi (if SC allows)",
            answer:
              'kubectl patch pvc my-pvc -p \'{"spec":{"resources":{"requests":{"storage":"20Gi"}}}}\' (requires allowVolumeExpansion: true in StorageClass)',
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Create PV, PVC, verify binding",
            code: "kubectl apply -f pv.yaml (5Gi, RWO, hostPath)\\nkubectl apply -f pvc.yaml (3Gi, RWO)\\nkubectl get pv,pvc\\nkubectl describe pvc my-pvc | grep 'Bound'",
            output: "STATUS: Bound (PVC bound to PV successfully)",
          },
          {
            type: "program",
            question:
              "Program 2: Use PVC in pod, write data, delete pod, verify persistence",
            code: "kubectl run dbpod --image=postgres:15 --dry-run -o yaml > pod.yaml\\n# Add PVC mount at /var/lib/postgresql/data\\nkubectl apply -f pod.yaml\\nkubectl exec dbpod -- sh -c 'echo test > /var/lib/postgresql/data/file.txt'\\nkubectl delete pod dbpod\\nkubectl apply -f pod.yaml\\nkubectl exec dbpod -- cat /var/lib/postgresql/data/file.txt",
            output: "test (data persisted across pod deletion)",
          },
          {
            type: "program",
            question:
              "Program 3: Test RWO constraint - try mounting on two pods different nodes",
            code: "kubectl apply -f pvc-rwo.yaml (RWO)\\nkubectl run pod1 --image=nginx -- Applies and runs\\nkubectl run pod2 --image=nginx -- (add same PVC mount, schedule to different node)\\nkubectl describe pod pod2 | grep 'FailedAttachVolume'",
            output:
              "Error: volume already attached to different node (RWO violation)",
          },
          {
            type: "program",
            question: "Program 4: Test PV reclaim policy Retain",
            code: "kubectl apply -f pv-retain.yaml (persistentVolumeReclaimPolicy: Retain)\\nkubectl apply -f pvc.yaml\\nkubectl delete pvc my-pvc\\nkubectl get pv my-pv -o jsonpath='{.status.phase}'",
            output: "Released (PV not deleted, requires manual cleanup)",
          },
          {
            type: "program",
            question: "Program 5: Dynamic provisioning with StorageClass",
            code: "kubectl get storageclass\\nkubectl apply -f pvc-dynamic.yaml (storageClassName: standard)\\nkubectl get pv (auto-created PV appears)\\nkubectl describe pv | grep 'Provisioner'",
            output: "PV dynamically created by StorageClass provisioner",
          },
          {
            type: "program",
            question: "Program 6: Simulate pending PVC - no matching PV",
            code: "kubectl apply -f pvc-nomatch.yaml (request 100Gi, no PV has 100Gi)\\nkubectl get pvc pvc-nomatch\\nkubectl describe pvc pvc-nomatch",
            output:
              "STATUS: Pending, Events: waiting for a volume to be created or to become available",
          },
          {
            type: "program",
            question:
              "Program 7: Volume expansion (if supported by StorageClass)",
            code: 'kubectl get sc standard -o jsonpath=\'{.allowVolumeExpansion}\'\\nkubectl patch pvc my-pvc -p \'{\\"spec\\":{\\"resources\\":{\\"requests\\":{\\"storage\\":\\"20Gi\\"}}}}\'\\nkubectl get pvc my-pvc -o jsonpath=\'{.status.capacity.storage}\'',
            output:
              "20Gi (PVC expanded, pod may need restart to recognize new size)",
          },
        ],
      },
    ],
  },
  {
    category: "kubectl Commands",
    topics: [
      {
        id: "kubectl-basics",
        title: "Essential kubectl Commands",
        description:
          "Core commands for managing Kubernetes clusters and resources.",
        command: `# Cluster info
kubectl cluster-info
kubectl version
kubectl get nodes

# Get resources
kubectl get all
kubectl get pods --all-namespaces
kubectl get deployments -o wide
kubectl get services -o yaml

# Create/apply resources
kubectl apply -f manifest.yaml
kubectl apply -f ./manifests/
kubectl create deployment nginx --image=nginx

# Delete resources
kubectl delete -f manifest.yaml
kubectl delete pod my-pod
kubectl delete deployment my-deploy

# Describe resources
kubectl describe pod my-pod
kubectl describe node worker-1

# Edit resources
kubectl edit deployment my-deploy`,
        example: `# Watch resources in real-time
kubectl get pods -w
kubectl get events -w

# Get resource usage
kubectl top nodes
kubectl top pods

# Copy files to/from pod
kubectl cp ./local-file pod-name:/remote-path
kubectl cp pod-name:/remote-file ./local-file

# Run temporary pod
kubectl run test-pod --image=busybox --rm -it -- sh

# Debug pod
kubectl debug my-pod -it --image=busybox

# Diff before apply
kubectl diff -f manifest.yaml

# Label resources
kubectl label pods my-pod environment=production`,
        useCase:
          "Daily operations, troubleshooting, resource management, deployments",
        interviewQuestions: [
          {
            question:
              "What is the difference between kubectl create and kubectl apply?",
            answer:
              "create: imperative, creates new resource, errors if exists. apply: declarative, creates or updates, uses last-applied-configuration annotation. apply tracks changes, supports GitOps. Use apply for production.",
          },
          {
            question: "What are kubectl resource shortnames and why use them?",
            answer:
              "po=pods, svc=services, deploy=deployments, rs=replicasets, ns=namespaces, cm=configmaps, pv=persistentvolumes, pvc=persistentvolumeclaims, no=nodes. Faster typing: 'kubectl get po' vs 'kubectl get pods'. View all: kubectl api-resources.",
          },
          {
            question:
              "Output: kubectl get pods -o wide vs -o yaml. What additional info?",
            answer:
              "-o wide: IP, Node, Nominated Node, Readiness Gates (single line). -o yaml: full spec + status (multi-line). Use 'wide' for quick overview, 'yaml' for debugging/copying config.",
          },
          {
            question:
              "Tricky: kubectl delete pod with grace period. What is default and how to force?",
            answer:
              "Default: 30s grace period (SIGTERM, then SIGKILL after timeout). Force immediate: kubectl delete pod mypod --grace-period=0 --force. Dangerous: may cause data loss, only for stuck pods.",
          },
          {
            question: "What is --dry-run=client vs --dry-run=server?",
            answer:
              "client: validates locally, no API call. server: sends to API server, validates against admission controllers, doesn't persist. Use server for accurate validation (RBAC, webhooks). Combine with -o yaml for manifest generation.",
          },
          {
            question: "How to filter resources using field selectors?",
            answer:
              "kubectl get pods --field-selector=status.phase=Running,metadata.namespace=default. Limited fields supported (status.phase, metadata.name, metadata.namespace, spec.nodeName). Check: kubectl get <resource> --field-selector=''",
          },
          {
            question: "What is kubectl explain and why is it useful?",
            answer:
              "Shows documentation for resource fields. kubectl explain pod.spec.containers. Recursive: kubectl explain pod --recursive. No internet needed, version-specific docs. Faster than searching online.",
          },
          {
            question:
              "Tricky: kubectl get events vs kubectl describe. When to use each?",
            answer:
              "kubectl get events: cluster-wide events, sortable (--sort-by=.metadata.creationTimestamp), filterable by namespace. describe: events related to ONE resource only. Use 'get events' for overview, 'describe' for specific resource debugging.",
          },
          {
            question:
              "Output: kubectl delete -f manifest.yaml with multiple resources. What order?",
            answer:
              "Reverse order of creation. Services deleted before Pods, ConfigMaps after Pods using them. Prevents dependency issues. Use --cascade=foreground for waiting.",
          },
          {
            question: "What is kubectl top and what does it require?",
            answer:
              "Shows resource usage (CPU, memory). Requires metrics-server installed. kubectl top nodes (node usage), kubectl top pods (pod usage), kubectl top pods --containers (per-container). Not historical, current only.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "List all pods in all namespaces showing node and IP",
            answer: "kubectl get pods --all-namespaces -o wide",
          },
          {
            type: "output",
            question: "Generate deployment YAML without creating it",
            answer:
              "kubectl create deployment nginx --image=nginx --replicas=3 --dry-run=client -o yaml > deploy.yaml",
          },
          {
            type: "scenario",
            question:
              "Create pod with multiple labels (app=web, env=prod, version=1.0)",
            answer:
              "kubectl run mypod --image=nginx --labels='app=web,env=prod,version=1.0'",
          },
          {
            type: "debug",
            question:
              "Pod stuck in Pending. What kubectl commands to diagnose?",
            answer:
              "1) kubectl describe pod <name> (check Events). 2) kubectl get events --sort-by=.metadata.creationTimestamp. 3) kubectl top nodes (check resources). 4) kubectl get pvc (if volumes pending).",
          },
          {
            type: "command",
            question: "Watch pods for changes in real-time",
            answer: "kubectl get pods -w (or kubectl get pods --watch)",
          },
          {
            type: "tricky",
            question: "Copy file FROM pod container to local machine",
            answer:
              "kubectl cp <namespace>/<podname>:/path/to/file ./local-file (add -c <container> if multi-container pod)",
          },
          {
            type: "command",
            question: "Force delete a pod immediately (stuck in Terminating)",
            answer: "kubectl delete pod mypod --grace-period=0 --force",
          },
          {
            type: "scenario",
            question: "Get logs from previous crashed container",
            answer:
              "kubectl logs mypod --previous (or -p). Shows logs before CrashLoopBackOff restart.",
          },
          {
            type: "troubleshoot",
            question: "Service not routing to pods. Quick kubectl checks?",
            answer:
              "1) kubectl get endpoints <svc> (endpoints populated?). 2) kubectl get pods -l <selector> (pods matching selector?). 3) kubectl describe svc <svc> (check selector). 4) kubectl get pods -o wide (pod IPs match endpoints?).",
          },
          {
            type: "command",
            question: "Show explain documentation for pod containers spec",
            answer:
              "kubectl explain pod.spec.containers (or kubectl explain pod.spec.containers.resources for nested)",
          },
        ],
        programExercises: [
          {
            type: "program",
            question:
              "Program 1: Create deployment imperatively, scale, verify",
            code: "kubectl create deployment web --image=nginx --replicas=2\\nkubectl get deploy web\\nkubectl scale deployment web --replicas=5\\nkubectl get pods -l app=web --no-headers | wc -l",
            output: "5 (scaled to 5 replicas)",
          },
          {
            type: "program",
            question: "Program 2: Generate pod YAML, modify, apply",
            code: "kubectl run testpod --image=busybox --dry-run=client -o yaml -- sleep 3600 > pod.yaml\\n# Edit pod.yaml to add label app=test\\nkubectl apply -f pod.yaml\\nkubectl get pod testpod -o jsonpath='{.metadata.labels.app}'",
            output: "test",
          },
          {
            type: "program",
            question: "Program 3: Test field selector filtering",
            code: "kubectl run pod1 --image=nginx\\nkubectl run pod2 --image=busybox -- sleep 3600\\nkubectl get pods --field-selector=status.phase=Running",
            output: "Only Running pods listed (pod1, pod2 if both running)",
          },
          {
            type: "program",
            question: "Program 4: Copy file to pod, exec in pod, verify",
            code: "echo 'Hello Kubernetes' > test.txt\\nkubectl run filepod --image=nginx\\nkubectl cp test.txt filepod:/usr/share/nginx/html/index.html\\nkubectl exec filepod -- cat /usr/share/nginx/html/index.html",
            output: "Hello Kubernetes",
          },
          {
            type: "program",
            question: "Program 5: Test dry-run server validation",
            code: "kubectl run test --image=nginx --dry-run=server -o yaml > test.yaml\\nkubectl apply -f test.yaml --dry-run=server\\nkubectl get pods test",
            output: "Error: pod not found (dry-run didn't create resource)",
          },
          {
            type: "program",
            question: "Program 6: Check resource usage with top",
            code: "kubectl top nodes\\nkubectl top pods --all-namespaces --sort-by=memory",
            output:
              "Nodes and pods sorted by memory usage (requires metrics-server)",
          },
          {
            type: "program",
            question: "Program 7: Watch events in real-time",
            code: "kubectl get events -w --sort-by=.metadata.creationTimestamp &\\nkubectl run eventtest --image=nginx\\n# Watch shows pod scheduling, pulling, starting events in real-time",
            output:
              "Events stream: Scheduled → Pulling → Pulled → Created → Started",
          },
        ],
      },
      {
        id: "kubectl-advanced",
        title: "Advanced kubectl Commands",
        description:
          "Powerful kubectl commands for complex operations and debugging.",
        command: `# JSONPath queries
kubectl get pods -o jsonpath='{.items[*].metadata.name' }

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# Filter with field selectors
kubectl get pods --field-selector=status.phase=Running

# Filter with label selectors
kubectl get pods -l app=nginx,version=v1
kubectl get pods -l 'environment in (dev,staging)'

# Patch resources
kubectl patch deployment my-deploy -p '{"spec":{"replicas":5}}'

# Wait for condition
kubectl wait --for=condition=ready pod/my-pod --timeout=60s

# Drain node (for maintenance)
kubectl drain node-1 --ignore-daemonsets

# Cordon node (prevent scheduling)
kubectl cordon node-1
kubectl uncordon node-1`,
        example: `# Get logs from all containers in pod
kubectl logs my-pod --all-containers=true

# Logs from previous crashed container
kubectl logs my-pod --previous

# Logs with timestamps
kubectl logs my-pod --timestamps

# Follow logs from multiple pods
kubectl logs -l app=nginx -f

# Resource usage filtering
kubectl top pods --sort-by=memory
kubectl top pods -l app=nginx

# Export resources
kubectl get deployment my-deploy -o yaml > deploy.yaml

# API resources
kubectl api-resources
kubectl explain pod.spec.containers`,
        useCase:
          "Advanced troubleshooting, automation, complex queries, node maintenance",
        interviewQuestions: [
          {
            question: "What is JSONPath in kubectl and provide example?",
            answer:
              "Query language for extracting JSON data. kubectl get pods -o jsonpath='{.items[*].metadata.name}'. Useful: {.items[*].status.podIP} for IPs, {.items[?(@.status.phase==\\\"Running\\\")].metadata.name} for filtering. More powerful than grep.",
          },
          {
            question: "Explain kubectl patch types: strategic, merge, json",
            answer:
              "strategic-merge (default): intelligent merge (adds to arrays). merge: JSON merge patch (replaces arrays). json: JSON patch (RFC 6902, operations: add/remove/replace). Strategic best for K8s, JSON for precise operations.",
          },
          {
            question:
              'Output: kubectl patch deploy nginx --type json -p \'[{\\"op\\":\\"replace\\",\\"path\\":\\"/spec/replicas\\",\\"value\\":5}]\'. What happens?',
            answer:
              "Replicas set to 5 using JSON patch format. 'op' is operation (replace/add/remove), 'path' is JSON pointer, 'value' is new value. More verbose than strategic merge but allows precise array operations.",
          },
          {
            question: "What is kubectl wait and real-world use case?",
            answer:
              "Waits for condition before proceeding. kubectl wait --for=condition=ready pod/mypod --timeout=60s. Use in CI/CD: wait for deployment rollout. kubectl wait --for=condition=available deployment/myapp. Non-zero exit if timeout.",
          },
          {
            question:
              "Tricky: kubectl drain vs cordon vs delete node. Differences?",
            answer:
              "cordon: mark unschedulable, pods stay. drain: cordon + evict pods (respects PDB). delete: remove from cluster. Drain for maintenance (kubectl drain --ignore-daemonsets), cordon for investigation, delete for permanent removal.",
          },
          {
            question:
              "What are custom columns and when are they better than JSONPath?",
            answer:
              "kubectl get pods -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,IP:.status.podIP. More readable than JSONPath for tabular data. Supports sorting. Alternative to 'wide' with specific fields.",
          },
          {
            question:
              "How to debug a pod that immediately crashes using kubectl debug?",
            answer:
              "kubectl debug mypod -it --image=busybox --copy-to=debug-mypod. Creates copy of pod with new container. Or kubectl debug mypod -it --image=busybox --target=mycontainer (ephemeral container in same pod, K8s v1.23+).",
          },
          {
            question:
              "Predict: kubectl logs -l app=nginx --tail=10. What if 3 pods match?",
            answer:
              "Shows last 10 lines from FIRST pod only! Not aggregated. For all pods: kubectl logs -l app=nginx --all-containers --prefix. Or use stern tool for multi-pod log tailing.",
          },
          {
            question:
              "What is kubectl set image vs kubectl patch for updating image?",
            answer:
              'kubectl set image deployment/nginx nginx=nginx:1.21 (imperative shortcut). kubectl patch deployment nginx -p \'{\\"spec\\":{\\"template\\":{\\"spec\\":{\\"containers\\":[{\\"name\\":\\"nginx\\",\\"image\\":\\"nginx:1.21\\"}]}}}}\' (more flexible). Use \'set image\' for simple updates.',
          },
          {
            question:
              "Tricky: kubectl get with multiple selectors. Can you combine label and field selectors?",
            answer:
              "Yes! kubectl get pods -l app=nginx --field-selector=status.phase=Running. Both filters applied (AND logic). Label for user-defined, field for system properties. Powerful for complex queries.",
          },
        ],
        exercises: [
          {
            type: "command",
            question: "Get all pod names and their IPs using JSONPath",
            answer:
              'kubectl get pods -o jsonpath=\'{range .items[*]}{.metadata.name}{\\"\\\\t\\"}{.status.podIP}{\\"\\\\n\\"}{end}\'',
          },
          {
            type: "output",
            question: "Custom columns: pod name, status, node, IP",
            answer:
              "kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName,IP:.status.podIP",
          },
          {
            type: "scenario",
            question: "Wait for deployment to be available with 5 min timeout",
            answer:
              "kubectl wait --for=condition=available deployment/myapp --timeout=300s",
          },
          {
            type: "debug",
            question: "Debug CrashLoopBackOff pod by creating debug copy",
            answer:
              "kubectl debug crashpod -it --copy-to=debugpod --image=busybox -- sh",
          },
          {
            type: "command",
            question: "Drain node for maintenance, ignore DaemonSets",
            answer:
              "kubectl drain worker-1 --ignore-daemonsets --delete-emptydir-data",
          },
          {
            type: "tricky",
            question:
              "Patch deployment to add new env var using strategic merge",
            answer:
              'kubectl patch deployment nginx --type strategic -p \'{\\"spec\\":{\\"template\\":{\\"spec\\":{\\"containers\\":[{\\"name\\":\\"nginx\\",\\"env\\":[{\\"name\\":\\"DEBUG\\",\\"value\\":\\"true\\"}]}]}}}}\'',
          },
          {
            type: "command",
            question: "Get pods in Running status using JSONPath filter",
            answer:
              "kubectl get pods -o jsonpath='{.items[?(@.status.phase==\\\"Running\\\")].metadata.name}'",
          },
          {
            type: "scenario",
            question:
              "Follow logs from all pods with label app=backend, show container names",
            answer: "kubectl logs -l app=backend -f --all-containers --prefix",
          },
          {
            type: "troubleshoot",
            question: "Node NotReady. Investigate and drain if needed.",
            answer:
              "1) kubectl describe node <node> (check conditions). 2) kubectl get pods -o wide --field-selector=spec.nodeName=<node>. 3) If maintenance needed: kubectl drain <node> --ignore-daemonsets --force.",
          },
          {
            type: "output",
            question: "Update deployment image using kubectl set image",
            answer:
              "kubectl set image deployment/nginx nginx=nginx:1.21 (assuming container name is 'nginx')",
          },
        ],
        programExercises: [
          {
            type: "program",
            question: "Program 1: Extract pod IPs with JSONPath",
            code: "kubectl run pod1 --image=nginx\\nkubectl run pod2 --image=nginx\\nkubectl get pods -o jsonpath='{.items[*].status.podIP}'",
            output: "10.244.1.5 10.244.1.6 (space-separated IPs)",
          },
          {
            type: "program",
            question: "Program 2: Patch deployment replicas using JSON patch",
            code: 'kubectl create deployment test --image=nginx --replicas=2\\nkubectl patch deployment test --type json -p \'[{\\"op\\":\\"replace\\",\\"path\\":\\"/spec/replicas\\",\\"value\\":5}]\'\\nkubectl get deployment test -o jsonpath=\'{.spec.replicas}\'',
            output: "5",
          },
          {
            type: "program",
            question: "Program 3: Wait for pod ready condition in script",
            code: "kubectl run waitpod --image=nginx\\nkubectl wait --for=condition=ready pod/waitpod --timeout=60s\\necho $?",
            output: "0 (exit code 0 on success, non-zero on timeout)",
          },
          {
            type: "program",
            question: "Program 4: Custom columns for deployment details",
            code: "kubectl create deployment app1 --image=nginx --replicas=3\\nkubectl create deployment app2 --image=busybox --replicas=2 -- sleep 3600\\nkubectl get deployments -o custom-columns=NAME:.metadata.name,REPLICAS:.spec.replicas,AVAILABLE:.status.availableReplicas",
            output:
              "NAME  REPLICAS  AVAILABLE\\napp1  3         3\\napp2  2         2",
          },
          {
            type: "program",
            question: "Program 5: Cordon node, verify no new pods scheduled",
            code: "kubectl cordon worker-1\\nkubectl run testsched --image=nginx\\nkubectl get pod testsched -o jsonpath='{.spec.nodeName}'\\nkubectl uncordon worker-1",
            output: "Pod scheduled to different node (worker-1 cordoned)",
          },
          {
            type: "program",
            question:
              "Program 6: Filter running pods with label using JSONPath",
            code: "kubectl run p1 --image=nginx -l app=test\\nkubectl run p2 --image=busybox -l app=test -- sleep 30\\nkubectl get pods -l app=test -o jsonpath='{.items[?(@.status.phase==\\\"Running\\\")].metadata.name}'",
            output: "p1 (only running pod with label app=test)",
          },
          {
            type: "program",
            question:
              "Program 7: Debug crashed pod by creating ephemeral container",
            code: "kubectl run crashpod --image=nginx --restart=Never\\nkubectl exec crashpod -- rm /usr/share/nginx/html/index.html\\n# Pod crashes\\nkubectl debug crashpod -it --image=busybox --target=crashpod -- sh\\n# Inside debug container: ls /proc/1/root/usr/share/nginx/html",
            output:
              "Can inspect filesystem of crashed container via shared process namespace",
          },
        ],
      },
    ],
  },
];

export const kubernetesQuiz = [
  {
    question: "What is a Pod in Kubernetes?",
    options: [
      "A container",
      "The smallest deployable unit that can contain one or more containers",
      "A type of storage",
      "A network interface",
    ],
    correctAnswer: 1,
    explanation:
      "A Pod is the smallest and simplest Kubernetes object. It represents a single instance of a running process and can contain one or more tightly coupled containers that share network and storage.",
  },
  {
    question: "What does a Deployment resource do?",
    options: [
      "Stores configuration",
      "Manages a replicated application with rolling updates",
      "Creates networks",
      "Monitors logs",
    ],
    correctAnswer: 1,
    explanation:
      "A Deployment manages replica Pods and provides declarative updates for Pods and ReplicaSets. It handles rolling updates, rollbacks, and ensures the desired number of replicas are running.",
  },
  {
    question: "What is the purpose of a Service in Kubernetes?",
    options: [
      "To provide a stable endpoint to access Pods",
      "To store data",
      "To build images",
      "To monitor resources",
    ],
    correctAnswer: 0,
    explanation:
      "A Service provides a stable network endpoint to access a set of Pods. Even as Pods are created and destroyed, the Service maintains a consistent way to reach your application.",
  },
  {
    question: "What does kubectl apply do?",
    options: [
      "Deletes resources",
      "Creates or updates resources from a configuration file",
      "Restarts containers",
      "Backs up the cluster",
    ],
    correctAnswer: 1,
    explanation:
      "'kubectl apply' creates new resources or updates existing ones based on the configuration in a file. It's declarative and idempotent, making it safe to run multiple times.",
  },
  {
    question: "What is a ConfigMap used for?",
    options: [
      "To store sensitive data",
      "To store non-sensitive configuration data as key-value pairs",
      "To create deployments",
      "To monitor resources",
    ],
    correctAnswer: 1,
    explanation:
      "ConfigMaps store non-sensitive configuration data in key-value pairs. They allow you to decouple configuration from container images, making applications more portable.",
  },
  {
    question: "How is a Secret different from a ConfigMap?",
    options: [
      "They are the same",
      "Secrets are intended for sensitive data and are base64 encoded",
      "ConfigMaps are encrypted",
      "Secrets are faster",
    ],
    correctAnswer: 1,
    explanation:
      "Secrets are similar to ConfigMaps but specifically designed for sensitive information like passwords and tokens. They are base64 encoded and have additional security features.",
  },
  {
    question:
      "What does 'kubectl get pods -o wide' show compared to regular 'kubectl get pods'?",
    options: [
      "The same information",
      "Additional details like node placement and IP addresses",
      "Only running pods",
      "Fewer details",
    ],
    correctAnswer: 1,
    explanation:
      "The '-o wide' flag provides additional details including the node each Pod is running on, Pod IP addresses, and nominated nodes, which is useful for debugging and monitoring.",
  },
  {
    question: "What is Kubernetes?",
    options: [
      "A container runtime",
      "An open-source container orchestration platform",
      "A programming language",
      "An operating system",
    ],
    correctAnswer: 1,
    explanation:
      "Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications across clusters of hosts.",
  },
  {
    question: "What is a Node in Kubernetes?",
    options: [
      "A container",
      "A worker machine (VM or physical) that runs Pods",
      "A network node",
      "A data node",
    ],
    correctAnswer: 1,
    explanation:
      "A Node is a worker machine (virtual or physical) in Kubernetes that runs Pods. Each node contains services necessary to run Pods: kubelet, container runtime, and kube-proxy.",
  },
  {
    question: "What is a Cluster?",
    options: [
      "A group of containers",
      "A set of Nodes managed by Kubernetes control plane",
      "A data cluster",
      "A network cluster",
    ],
    correctAnswer: 1,
    explanation:
      "A Cluster is a set of worker machines (nodes) that run containerized applications. Every cluster has at least one worker node and a control plane that manages the cluster.",
  },
  {
    question: "What is the Control Plane?",
    options: [
      "A dashboard",
      "Components that manage cluster state and make scheduling decisions",
      "A control interface",
      "A monitoring tool",
    ],
    correctAnswer: 1,
    explanation:
      "The Control Plane manages the Kubernetes cluster, making global decisions (scheduling), detecting and responding to events. Includes API server, scheduler, controller manager, and etcd.",
  },
  {
    question: "What is kubectl?",
    options: [
      "A container",
      "Command-line tool for interacting with Kubernetes clusters",
      "A cluster manager",
      "A config file",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl is the command-line tool for communicating with Kubernetes API server. It allows you to deploy applications, inspect resources, view logs, and manage cluster operations.",
  },
  {
    question: "What does kubectl get pods do?",
    options: [
      "Creates pods",
      "Lists all Pods in the current namespace",
      "Deletes pods",
      "Updates pods",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl get pods lists all Pods in the current namespace showing name, status, restarts, and age. Use -A or --all-namespaces to see pods across all namespaces.",
  },
  {
    question: "What is a Namespace?",
    options: [
      "A named space",
      "Virtual cluster for resource isolation and organization",
      "A storage namespace",
      "A network namespace",
    ],
    correctAnswer: 1,
    explanation:
      "Namespace provides a mechanism for isolating groups of resources within a single cluster. Names of resources must be unique within a namespace but not across namespaces.",
  },
  {
    question: "What is the default namespace?",
    options: [
      "default",
      "default namespace for objects without other namespace",
      "kube-system",
      "public",
    ],
    correctAnswer: 0,
    explanation:
      "The 'default' namespace is where objects are placed when no other namespace is specified. Kubernetes also has kube-system, kube-public, and kube-node-lease namespaces.",
  },
  {
    question: "What does kubectl describe do?",
    options: [
      "Describes use cases",
      "Shows detailed information about a resource",
      "Creates descriptions",
      "Lists resources",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl describe provides detailed information about a resource including events, conditions, and configuration. More detailed than kubectl get. Example: kubectl describe pod my-pod.",
  },
  {
    question: "What is a ReplicaSet?",
    options: [
      "A set of replicas",
      "Ensures specified number of Pod replicas are running",
      "A data replica",
      "A backup set",
    ],
    correctAnswer: 1,
    explanation:
      "ReplicaSet ensures a specified number of Pod replicas are running at any time. Usually managed by Deployment. Creates/deletes Pods to maintain desired replica count.",
  },
  {
    question: "What is the difference between Deployment and ReplicaSet?",
    options: [
      "No difference",
      "Deployment manages ReplicaSets and provides declarative updates",
      "ReplicaSet is newer",
      "Deployment is deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "Deployment is higher-level concept that manages ReplicaSets and provides declarative updates, rolling updates, and rollbacks. ReplicaSet just maintains replica count.",
  },
  {
    question: "What does kubectl logs do?",
    options: [
      "Creates logs",
      "Prints container logs from a Pod",
      "Views system logs",
      "Deletes logs",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl logs retrieves logs from a container in a Pod. Use -f to follow logs, -c to specify container in multi-container pod, --previous for previous container instance.",
  },
  {
    question: "What does kubectl exec do?",
    options: [
      "Executes commands",
      "Runs a command inside a container in a Pod",
      "Executes pods",
      "Creates executables",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl exec executes commands in a container. kubectl exec -it pod-name -- /bin/bash opens interactive shell. Useful for debugging and troubleshooting.",
  },
  {
    question: "What is a Label in Kubernetes?",
    options: [
      "A name tag",
      "Key-value pairs attached to objects for identification and selection",
      "A text label",
      "A description",
    ],
    correctAnswer: 1,
    explanation:
      "Labels are key-value pairs attached to objects like Pods. Used to organize and select subsets of objects. Selectors use labels to query and filter resources.",
  },
  {
    question: "What is a Selector?",
    options: [
      "Selection tool",
      "Mechanism to filter resources based on labels",
      "Dropdown selector",
      "Query selector",
    ],
    correctAnswer: 1,
    explanation:
      "Selectors use labels to identify sets of objects. Two types: equality-based (=, ==, !=) and set-based (in, notin, exists). Services and ReplicaSets use selectors.",
  },
  {
    question: "What is an Annotation?",
    options: [
      "A note",
      "Non-identifying metadata attached to objects",
      "A label",
      "A comment",
    ],
    correctAnswer: 1,
    explanation:
      "Annotations are key-value pairs for attaching arbitrary non-identifying metadata. Unlike labels, not used for selection. Used for tooling, libraries, or user information.",
  },
  {
    question: "What are the types of Services?",
    options: [
      "Only ClusterIP",
      "ClusterIP, NodePort, LoadBalancer, ExternalName",
      "Internal and External",
      "Public and Private",
    ],
    correctAnswer: 1,
    explanation:
      "Service types: ClusterIP (internal only, default), NodePort (exposes on node port), LoadBalancer (cloud load balancer), ExternalName (DNS CNAME).",
  },
  {
    question: "What is ClusterIP Service?",
    options: [
      "IP address",
      "Service accessible only within cluster on internal IP",
      "Cluster address",
      "External IP",
    ],
    correctAnswer: 1,
    explanation:
      "ClusterIP is the default Service type. Exposes Service on internal IP within cluster. Only reachable from within cluster, not from outside.",
  },
  {
    question: "What is NodePort Service?",
    options: [
      "Node address",
      "Exposes Service on static port on each Node's IP",
      "Port mapping",
      "SSH port",
    ],
    correctAnswer: 1,
    explanation:
      "NodePort exposes Service on a static port (30000-32767 by default) on each Node's IP. Accessible from outside cluster using <NodeIP>:<NodePort>.",
  },
  {
    question: "What is LoadBalancer Service?",
    options: [
      "Load balancing tool",
      "Exposes Service via cloud provider's load balancer",
      "Internal balancer",
      "Traffic distributor",
    ],
    correctAnswer: 1,
    explanation:
      "LoadBalancer creates external load balancer (in supported cloud providers) and assigns external IP. Automatically creates NodePort and ClusterIP Services.",
  },
  {
    question: "What is a DaemonSet?",
    options: [
      "A daemon process",
      "Ensures all or selected Nodes run a copy of a Pod",
      "System service",
      "Background task",
    ],
    correctAnswer: 1,
    explanation:
      "DaemonSet ensures all (or some) Nodes run a copy of a Pod. As nodes are added/removed, Pods are added/removed. Used for node monitoring, logging, storage daemons.",
  },
  {
    question: "What is a StatefulSet?",
    options: [
      "Stateful application",
      "Manages stateful applications with stable identity and storage",
      "State manager",
      "Static set",
    ],
    correctAnswer: 1,
    explanation:
      "StatefulSet is for stateful applications requiring stable network identity, stable persistent storage, and ordered deployment/scaling. Used for databases, queues.",
  },
  {
    question: "What is the difference between Deployment and StatefulSet?",
    options: [
      "No difference",
      "StatefulSet provides stable identity and ordered deployment, Deployment doesn't",
      "Deployment is newer",
      "StatefulSet is faster",
    ],
    correctAnswer: 1,
    explanation:
      "StatefulSet maintains sticky identity for each Pod (ordinal index, stable hostname, stable storage). Deployment treats Pods as interchangeable. Use StatefulSet for stateful apps.",
  },
  {
    question: "What is a Job?",
    options: [
      "Work task",
      "Creates Pods to run a task to completion",
      "Cron job",
      "Batch job",
    ],
    correctAnswer: 1,
    explanation:
      "Job creates one or more Pods and ensures specified number successfully complete. Used for batch processing, one-time tasks. Tracks successful completions.",
  },
  {
    question: "What is a CronJob?",
    options: [
      "Cron scheduler",
      "Creates Jobs on repeating schedule",
      "Time-based job",
      "Scheduled task",
    ],
    correctAnswer: 1,
    explanation:
      "CronJob creates Jobs on a repeating schedule written in Cron format. Used for periodic tasks like backups, report generation, sending emails.",
  },
  {
    question: "What is a Volume in Kubernetes?",
    options: [
      "Storage volume",
      "Directory accessible to containers in a Pod",
      "Disk volume",
      "Data volume",
    ],
    correctAnswer: 1,
    explanation:
      "Volume is a directory accessible to containers in a Pod. Comes in many types (emptyDir, hostPath, PersistentVolume). Data persists across container restarts.",
  },
  {
    question: "What is a PersistentVolume (PV)?",
    options: [
      "Permanent storage",
      "Cluster-wide storage resource provisioned by admin",
      "Volume backup",
      "Persistent data",
    ],
    correctAnswer: 1,
    explanation:
      "PersistentVolume is a piece of storage provisioned by admin or dynamically using StorageClass. Cluster resource independent of Pod lifecycle. Has lifecycle independent of Pods.",
  },
  {
    question: "What is a PersistentVolumeClaim (PVC)?",
    options: [
      "Volume request",
      "Request for storage by a user/Pod",
      "Claim ticket",
      "Storage claim",
    ],
    correctAnswer: 1,
    explanation:
      "PVC is a request for storage by user. Claims can request specific size and access modes. Kubernetes binds PVC to matching PV. Pods use PVCs to access storage.",
  },
  {
    question: "What is a StorageClass?",
    options: [
      "Storage type",
      "Describes storage profiles and enables dynamic provisioning",
      "Storage category",
      "Disk class",
    ],
    correctAnswer: 1,
    explanation:
      "StorageClass describes storage 'classes' (performance tiers) and enables dynamic provisioning of PersistentVolumes. Admins can offer different classes (fast SSD, slow HDD).",
  },
  {
    question: "What are volume access modes?",
    options: [
      "Read and Write",
      "ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod",
      "Public and Private",
      "Local and Remote",
    ],
    correctAnswer: 1,
    explanation:
      "Access modes: ReadWriteOnce (RWO - single node R/W), ReadOnlyMany (ROX - many nodes read-only), ReadWriteMany (RWX - many nodes R/W), ReadWriteOncePod (RWOP - single pod).",
  },
  {
    question: "What is an Ingress?",
    options: [
      "Entrance",
      "Manages external HTTP/HTTPS access to services in cluster",
      "Network ingress",
      "Entry point",
    ],
    correctAnswer: 1,
    explanation:
      "Ingress manages external HTTP/HTTPS access to Services. Provides load balancing, SSL termination, name-based virtual hosting. Requires Ingress Controller to function.",
  },
  {
    question: "What is an Ingress Controller?",
    options: [
      "Traffic controller",
      "Component that fulfills Ingress rules (e.g., nginx, traefik)",
      "Network controller",
      "API controller",
    ],
    correctAnswer: 1,
    explanation:
      "Ingress Controller is a component that fulfills Ingress rules. Not started automatically. Popular controllers: nginx, traefik, HAProxy, Kong. Reads Ingress resources and configures routing.",
  },
  {
    question: "What is a NetworkPolicy?",
    options: [
      "Network rules",
      "Specification for controlling network traffic between Pods",
      "Firewall policy",
      "Network configuration",
    ],
    correctAnswer: 1,
    explanation:
      "NetworkPolicy controls traffic flow at IP address or port level. Acts like firewall rules for Pods. Requires network plugin that supports NetworkPolicies (Calico, Cilium).",
  },
  {
    question: "What does kubectl delete do?",
    options: [
      "Deletes files",
      "Deletes resources from cluster",
      "Removes containers",
      "Clears cache",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl delete removes resources from cluster. Can delete by file (kubectl delete -f file.yaml), by resource name, or by label selector. Use --grace-period for controlled shutdown.",
  },
  {
    question: "What does kubectl scale do?",
    options: [
      "Scales images",
      "Changes number of replicas for a resource",
      "Scales cluster",
      "Measures scale",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl scale changes replica count for Deployment, ReplicaSet, or StatefulSet. Example: kubectl scale deployment nginx --replicas=5. Can also use autoscaling.",
  },
  {
    question: "What is a Horizontal Pod Autoscaler (HPA)?",
    options: [
      "Pod scaler",
      "Automatically scales number of Pods based on metrics",
      "Horizontal scaling",
      "Auto-balancer",
    ],
    correctAnswer: 1,
    explanation:
      "HPA automatically scales replica count based on observed metrics (CPU, memory, custom metrics). Periodically queries metrics and adjusts replicas to meet target.",
  },
  {
    question: "What is a Vertical Pod Autoscaler (VPA)?",
    options: [
      "Vertical scaling",
      "Automatically adjusts CPU and memory requests/limits for containers",
      "Pod resizer",
      "Resource adjuster",
    ],
    correctAnswer: 1,
    explanation:
      "VPA automatically sets resource requests and limits for containers based on usage. Frees users from setting resource requirements. Can update running Pods or just provide recommendations.",
  },
  {
    question: "What is a LimitRange?",
    options: [
      "Resource limits",
      "Policy to constrain resource allocations per Pod/Container in namespace",
      "Range limit",
      "Boundary setting",
    ],
    correctAnswer: 1,
    explanation:
      "LimitRange constrains resource allocation (CPU, memory) per Pod or Container. Sets default requests/limits and enforces min/max values in a namespace.",
  },
  {
    question: "What is a ResourceQuota?",
    options: [
      "Resource limit",
      "Constraints on aggregate resource consumption per namespace",
      "Quota system",
      "Usage limit",
    ],
    correctAnswer: 1,
    explanation:
      "ResourceQuota limits aggregate resource consumption per namespace. Can limit total CPU/memory, number of objects (Pods, Services), storage requests. Enforces limits at namespace level.",
  },
  {
    question: "What does kubectl rollout status do?",
    options: [
      "Rolls out updates",
      "Shows status of a rollout",
      "Creates rollout",
      "Stops rollout",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl rollout status shows the status of a rollout. kubectl rollout status deployment/nginx watches rollout until completion. Useful for CI/CD pipelines.",
  },
  {
    question: "What does kubectl rollout undo do?",
    options: [
      "Undoes changes",
      "Rolls back to previous revision",
      "Removes rollout",
      "Cancels deployment",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl rollout undo rolls back to previous revision. Can specify revision with --to-revision. Useful when new deployment has issues. View history with rollout history.",
  },
  {
    question: "What does kubectl rollout restart do?",
    options: [
      "Restarts cluster",
      "Triggers rolling restart of Pods",
      "Reboots nodes",
      "Restarts service",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl rollout restart triggers a rolling restart of all Pods managed by resource without changing configuration. Useful for picking up ConfigMap/Secret changes.",
  },
  {
    question: "What is a Probe in Kubernetes?",
    options: [
      "Investigation tool",
      "Health check performed by kubelet on containers",
      "Network probe",
      "Diagnostic tool",
    ],
    correctAnswer: 1,
    explanation:
      "Probe is a diagnostic performed by kubelet on containers. Three types: liveness (restart if fails), readiness (remove from service if fails), startup (delay other probes).",
  },
  {
    question: "What is a Liveness Probe?",
    options: [
      "Life check",
      "Checks if container is alive, restarts if fails",
      "Status check",
      "Running check",
    ],
    correctAnswer: 1,
    explanation:
      "Liveness Probe checks if container is running. If probe fails, kubelet kills and restarts container. Used to detect deadlocks or unresponsive applications.",
  },
  {
    question: "What is a Readiness Probe?",
    options: [
      "Ready check",
      "Checks if container is ready to serve traffic",
      "Startup check",
      "Service check",
    ],
    correctAnswer: 1,
    explanation:
      "Readiness Probe checks if container is ready to serve requests. If fails, Pod is removed from Service endpoints (stops receiving traffic). Used during startup or when overloaded.",
  },
  {
    question: "What is a Startup Probe?",
    options: [
      "Start check",
      "Checks if container application has started",
      "Boot check",
      "Initialize check",
    ],
    correctAnswer: 1,
    explanation:
      "Startup Probe checks if application has started. Disables liveness/readiness probes until succeeds. Useful for slow-starting containers to avoid premature restarts.",
  },
  {
    question: "What probe handlers are available?",
    options: [
      "Only HTTP",
      "HTTP GET, TCP Socket, Exec command",
      "Ping only",
      "Custom handlers",
    ],
    correctAnswer: 1,
    explanation:
      "Probe handlers: httpGet (HTTP GET request), tcpSocket (TCP connection), exec (executes command in container). Each returns success/failure. Choose based on application type.",
  },
  {
    question: "What is a Taint?",
    options: [
      "Node contamination",
      "Node property that repels Pods unless they tolerate it",
      "Node label",
      "Node defect",
    ],
    correctAnswer: 1,
    explanation:
      "Taint is applied to Nodes to repel Pods. Pods must have matching Toleration to be scheduled on tainted Node. Used for dedicated nodes, special hardware, node maintenance.",
  },
  {
    question: "What is a Toleration?",
    options: [
      "Pod tolerance",
      "Pod property allowing scheduling on Nodes with matching Taints",
      "Node acceptance",
      "Permission",
    ],
    correctAnswer: 1,
    explanation:
      "Toleration is applied to Pods, allowing (but not requiring) them to schedule onto Nodes with matching Taints. Works with Taints to ensure Pods schedule on appropriate Nodes.",
  },
  {
    question: "What are Taint effects?",
    options: [
      "Side effects",
      "NoSchedule, PreferNoSchedule, NoExecute",
      "Taint levels",
      "Impact types",
    ],
    correctAnswer: 1,
    explanation:
      "Taint effects: NoSchedule (don't schedule new Pods), PreferNoSchedule (try not to schedule), NoExecute (evict existing Pods without toleration). Controls scheduling behavior.",
  },
  {
    question: "What is Node Affinity?",
    options: [
      "Node preference",
      "Rules for scheduling Pods on Nodes based on Node labels",
      "Node grouping",
      "Node attraction",
    ],
    correctAnswer: 1,
    explanation:
      "Node Affinity constrains which Nodes Pods can be scheduled on based on Node labels. Two types: required (hard) and preferred (soft). More expressive than nodeSelector.",
  },
  {
    question: "What is Pod Affinity?",
    options: [
      "Pod friendship",
      "Rules for co-locating Pods based on labels",
      "Pod grouping",
      "Pod attraction",
    ],
    correctAnswer: 1,
    explanation:
      "Pod Affinity allows specifying that Pods should be co-located (scheduled on same Node or zone) with other Pods matching label selector. Useful for performance.",
  },
  {
    question: "What is Pod Anti-Affinity?",
    options: [
      "Pod dislike",
      "Rules for spreading Pods across Nodes/zones",
      "Pod separation",
      "Pod repulsion",
    ],
    correctAnswer: 1,
    explanation:
      "Pod Anti-Affinity specifies that Pods should not be co-located with other Pods matching selector. Used for high availability, spreading replicas across failure domains.",
  },
  {
    question: "What is a ServiceAccount?",
    options: [
      "Service user",
      "Identity for processes running in Pods",
      "User account",
      "API account",
    ],
    correctAnswer: 1,
    explanation:
      "ServiceAccount provides identity for processes running in Pods. Used for authentication to API server. Automatically mounted into Pods. Different from user accounts.",
  },
  {
    question: "What is RBAC in Kubernetes?",
    options: [
      "Access control",
      "Role-Based Access Control for authorization",
      "Security system",
      "Authentication method",
    ],
    correctAnswer: 1,
    explanation:
      "RBAC (Role-Based Access Control) regulates access to resources based on roles. Uses Role, ClusterRole, RoleBinding, ClusterRoleBinding to define permissions.",
  },
  {
    question: "What is a Role in RBAC?",
    options: [
      "User role",
      "Set of permissions within a namespace",
      "Job role",
      "Security role",
    ],
    correctAnswer: 1,
    explanation:
      "Role contains rules defining permissions (verbs like get, list, create) on resources within a namespace. Grants permissions, never denies. Use RoleBinding to assign.",
  },
  {
    question: "What is a ClusterRole?",
    options: [
      "Cluster user",
      "Set of permissions across entire cluster",
      "Admin role",
      "Global role",
    ],
    correctAnswer: 1,
    explanation:
      "ClusterRole is like Role but cluster-scoped. Can grant access to cluster-scoped resources (nodes, PVs), non-resource endpoints, or resources across all namespaces.",
  },
  {
    question: "What is a RoleBinding?",
    options: [
      "Role assignment",
      "Grants Role permissions to users/groups/ServiceAccounts in a namespace",
      "Role connection",
      "Permission link",
    ],
    correctAnswer: 1,
    explanation:
      "RoleBinding grants permissions defined in a Role to users, groups, or ServiceAccounts within a namespace. Binds a Role or ClusterRole to subjects.",
  },
  {
    question: "What is a ClusterRoleBinding?",
    options: [
      "Cluster assignment",
      "Grants ClusterRole permissions across entire cluster",
      "Global binding",
      "Cluster permission",
    ],
    correctAnswer: 1,
    explanation:
      "ClusterRoleBinding grants permissions defined in ClusterRole cluster-wide. Used to grant access to cluster-scoped resources or across all namespaces.",
  },
  {
    question: "What is etcd?",
    options: [
      "Configuration tool",
      "Distributed key-value store for cluster data",
      "Database",
      "Cache system",
    ],
    correctAnswer: 1,
    explanation:
      "etcd is a consistent, distributed key-value store that stores all cluster data. It's the backing store for all Kubernetes cluster data. Critical component to backup.",
  },
  {
    question: "What is the kube-apiserver?",
    options: [
      "API endpoint",
      "Front-end for Kubernetes control plane, exposes Kubernetes API",
      "Web server",
      "API gateway",
    ],
    correctAnswer: 1,
    explanation:
      "kube-apiserver is the front end for Kubernetes control plane. Exposes Kubernetes API. All other components communicate through it. Horizontally scalable.",
  },
  {
    question: "What is the kube-scheduler?",
    options: [
      "Task scheduler",
      "Selects Nodes for newly created Pods",
      "Job scheduler",
      "Time scheduler",
    ],
    correctAnswer: 1,
    explanation:
      "kube-scheduler watches for newly created Pods with no assigned Node and selects a Node for them to run on. Factors: resource requirements, constraints, affinity, data locality.",
  },
  {
    question: "What is the kube-controller-manager?",
    options: [
      "System manager",
      "Runs controller processes (Node, Job, Service controllers)",
      "Process manager",
      "Resource manager",
    ],
    correctAnswer: 1,
    explanation:
      "kube-controller-manager runs controller processes. Controllers watch cluster state and make changes to move current state toward desired state. Includes Node, Job, Endpoint controllers.",
  },
  {
    question: "What is the cloud-controller-manager?",
    options: [
      "Cloud manager",
      "Runs cloud-specific controller logic",
      "Cloud interface",
      "Cloud connector",
    ],
    correctAnswer: 1,
    explanation:
      "cloud-controller-manager embeds cloud-specific control logic. Allows linking cluster to cloud provider API. Manages Node, Route, Service, Volume controllers for cloud.",
  },
  {
    question: "What is kubelet?",
    options: [
      "Small cube",
      "Agent running on each Node, ensures containers are running in Pods",
      "Container runtime",
      "Network agent",
    ],
    correctAnswer: 1,
    explanation:
      "kubelet is an agent running on each Node. Ensures containers described in PodSpecs are running and healthy. Communicates with control plane. Manages container lifecycle.",
  },
  {
    question: "What is kube-proxy?",
    options: [
      "Proxy server",
      "Network proxy running on each Node, maintains network rules",
      "API proxy",
      "Load balancer",
    ],
    correctAnswer: 1,
    explanation:
      "kube-proxy is a network proxy running on each Node. Maintains network rules allowing communication to Pods from inside/outside cluster. Implements Service abstraction.",
  },
  {
    question: "What is a container runtime?",
    options: [
      "Runtime environment",
      "Software responsible for running containers (Docker, containerd, CRI-O)",
      "Container engine",
      "Execution engine",
    ],
    correctAnswer: 1,
    explanation:
      "Container runtime is software responsible for running containers. Kubernetes supports: containerd, CRI-O, Docker Engine (deprecated). Must implement Kubernetes CRI.",
  },
  {
    question: "What does kubectl create vs kubectl apply do?",
    options: [
      "Same thing",
      "create is imperative (errors if exists), apply is declarative (creates or updates)",
      "create is faster",
      "apply is deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl create is imperative and errors if resource exists. kubectl apply is declarative, creates if doesn't exist or updates if exists. apply is preferred for GitOps.",
  },
  {
    question: "What is a Helm chart?",
    options: [
      "Navigation chart",
      "Package of Kubernetes resources with templating",
      "Graph chart",
      "Configuration file",
    ],
    correctAnswer: 1,
    explanation:
      "Helm chart is a package of pre-configured Kubernetes resources. Contains templates and values for deploying applications. Helm is package manager for Kubernetes.",
  },
  {
    question: "What does kubectl port-forward do?",
    options: [
      "Forwards ports",
      "Forwards local port to port on Pod for debugging",
      "Opens ports",
      "Tunnels traffic",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl port-forward forwards local port to port on Pod. Used for debugging and testing without exposing Service. Example: kubectl port-forward pod/nginx 8080:80.",
  },
  {
    question: "What does kubectl top do?",
    options: [
      "Shows top resources",
      "Displays resource usage (CPU/memory) for Nodes or Pods",
      "Lists top pods",
      "Shows rankings",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl top shows resource usage metrics. kubectl top node shows Node metrics, kubectl top pod shows Pod metrics. Requires metrics-server to be installed.",
  },
  {
    question: "What is the metrics-server?",
    options: [
      "Metrics endpoint",
      "Cluster-wide aggregator of resource usage data",
      "Monitoring server",
      "Statistics server",
    ],
    correctAnswer: 1,
    explanation:
      "metrics-server collects resource metrics from kubelets and exposes them through Metrics API. Required for kubectl top and HPA. Lightweight, in-memory, short-term metrics.",
  },
  {
    question: "What is the difference between requests and limits?",
    options: [
      "No difference",
      "Requests are guaranteed resources, limits are maximum allowed",
      "Limits are minimum",
      "Requests are maximum",
    ],
    correctAnswer: 1,
    explanation:
      "Requests: minimum resources guaranteed to container. Limits: maximum resources container can use. Scheduler uses requests for placement. Container throttled/killed if exceeds limits.",
  },
  {
    question: "What happens when a Pod exceeds memory limit?",
    options: [
      "Nothing",
      "Pod is OOMKilled (Out of Memory killed)",
      "Memory is expanded",
      "Warning only",
    ],
    correctAnswer: 1,
    explanation:
      "When Pod exceeds memory limit, it's OOMKilled (terminated due to Out Of Memory). Status shows OOMKilled. May be restarted based on restart policy.",
  },
  {
    question: "What happens when a Pod exceeds CPU limit?",
    options: [
      "Pod terminates",
      "CPU is throttled (limited) but Pod continues running",
      "Pod is killed",
      "Nothing happens",
    ],
    correctAnswer: 1,
    explanation:
      "When Pod exceeds CPU limit, CPU usage is throttled (limited) but Pod continues running. Unlike memory limits which cause termination, CPU is compressible resource.",
  },
  {
    question: "What is a PodDisruptionBudget (PDB)?",
    options: [
      "Budget limit",
      "Limits number of Pods that can be down during voluntary disruptions",
      "Cost budget",
      "Resource budget",
    ],
    correctAnswer: 1,
    explanation:
      "PDB limits number of Pods of replicated application that are down simultaneously from voluntary disruptions (maintenance, upgrades). Ensures minimum availability during disruptions.",
  },
  {
    question: "What are init containers?",
    options: [
      "Initial containers",
      "Specialized containers that run before app containers in Pod",
      "Setup containers",
      "Bootstrap containers",
    ],
    correctAnswer: 1,
    explanation:
      "Init containers run before app containers in Pod, run to completion sequentially. Used for setup tasks, waiting for dependencies, pre-population. If fails, Pod restarts.",
  },
  {
    question: "What are sidecar containers?",
    options: [
      "Side containers",
      "Helper containers running alongside main container in Pod",
      "Secondary containers",
      "Support containers",
    ],
    correctAnswer: 1,
    explanation:
      "Sidecar containers run alongside main container in Pod, sharing resources. Common patterns: logging agents, monitoring agents, proxies. Example: service mesh sidecars.",
  },
  {
    question: "What is a Custom Resource Definition (CRD)?",
    options: [
      "Custom config",
      "Extension of Kubernetes API that defines custom resource",
      "User definition",
      "Custom settings",
    ],
    correctAnswer: 1,
    explanation:
      "CRD extends Kubernetes API by defining custom resources. Once created, new custom resource can be created and managed like native resources. Foundation for operators.",
  },
  {
    question: "What is an Operator?",
    options: [
      "System administrator",
      "Method of packaging and managing Kubernetes application with domain knowledge",
      "User role",
      "Control operator",
    ],
    correctAnswer: 1,
    explanation:
      "Operator is method of packaging, deploying, and managing Kubernetes application. Extends Kubernetes using CRDs and controllers, encoding domain knowledge for managing complex applications.",
  },
  {
    question: "What does kubectl drain do?",
    options: [
      "Drains water",
      "Safely evicts Pods from Node for maintenance",
      "Removes resources",
      "Empties node",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl drain safely evicts Pods from Node, marking it as unschedulable. Used before Node maintenance. Respects PDBs. Use kubectl uncordon to make schedulable again.",
  },
  {
    question: "What does kubectl cordon do?",
    options: [
      "Blocks node",
      "Marks Node as unschedulable (no new Pods)",
      "Isolates node",
      "Seals node",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl cordon marks Node as unschedulable, preventing new Pods from being scheduled. Existing Pods continue running. Use uncordon to reverse. Less disruptive than drain.",
  },
  {
    question: "What is a Pod Security Policy (PSP)?",
    options: [
      "Security rules",
      "Cluster-level resource controlling security-sensitive aspects of Pods (deprecated)",
      "Access policy",
      "Security config",
    ],
    correctAnswer: 1,
    explanation:
      "PSP was cluster-level resource controlling security aspects of Pod specification (privileged, capabilities, volumes). Deprecated in 1.21, removed in 1.25. Use Pod Security Standards.",
  },
  {
    question: "What are Pod Security Standards?",
    options: [
      "Security guidelines",
      "Replacement for PSP: Privileged, Baseline, Restricted levels",
      "Security requirements",
      "Compliance standards",
    ],
    correctAnswer: 1,
    explanation:
      "Pod Security Standards replace PSP with three levels: Privileged (unrestricted), Baseline (minimally restrictive), Restricted (heavily restricted). Enforced via admission controller.",
  },
  {
    question: "What is a Quality of Service (QoS) class?",
    options: [
      "Service quality",
      "Classification of Pods (Guaranteed, Burstable, BestEffort) based on resources",
      "Performance class",
      "Priority level",
    ],
    correctAnswer: 1,
    explanation:
      "QoS class determines Pod eviction order under resource pressure. Three classes: Guaranteed (requests=limits), Burstable (some requests/limits), BestEffort (no requests/limits).",
  },
  {
    question: "What is a PriorityClass?",
    options: [
      "Priority level",
      "Defines priority value for Pods affecting scheduling and eviction order",
      "Class priority",
      "Importance level",
    ],
    correctAnswer: 1,
    explanation:
      "PriorityClass defines priority value assigned to Pods. Higher priority Pods are scheduled first and less likely to be evicted. Used for critical system components.",
  },
  {
    question: "What does kubectl attach do?",
    options: [
      "Attaches files",
      "Attaches to running process in container",
      "Connects to pod",
      "Mounts volumes",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl attach attaches to a running process inside a container. Similar to docker attach. Different from exec which starts new process. Use -it for interactive.",
  },
  {
    question: "What is a Finalizer?",
    options: [
      "Last step",
      "Keys preventing deletion until specific conditions met",
      "Cleanup function",
      "Termination handler",
    ],
    correctAnswer: 1,
    explanation:
      "Finalizers are keys preventing resource deletion until removed. Allow controllers to implement asynchronous pre-delete hooks. Object stuck in deletion until finalizers cleared.",
  },
  {
    question: "What is the difference between kubectl create and kubectl run?",
    options: [
      "No difference",
      "create creates resources from file/stdin, run creates and runs single Pod",
      "run is deprecated",
      "create is faster",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl create creates resources from file/stdin (generic). kubectl run creates and runs a particular image, typically for quick Pod creation or testing.",
  },
  {
    question: "What does kubectl explain do?",
    options: [
      "Explains concepts",
      "Shows documentation for resource fields",
      "Provides help",
      "Describes usage",
    ],
    correctAnswer: 1,
    explanation:
      "kubectl explain shows documentation for resource fields. Example: kubectl explain pod.spec.containers. Helps discover available fields and their types. Like inline documentation.",
  },
  {
    question: "What is context in kubectl?",
    options: [
      "Code context",
      "Set of access parameters (cluster, user, namespace)",
      "Environment context",
      "Runtime context",
    ],
    correctAnswer: 1,
    explanation:
      "Context is a cluster/user/namespace tuple in kubeconfig. kubectl uses current context for API requests. Switch with kubectl config use-context. View with kubectl config get-contexts.",
  },
];
