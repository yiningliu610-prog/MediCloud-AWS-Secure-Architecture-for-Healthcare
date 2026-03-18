export const lambdaCode = `import json
import os
from datetime import datetime, timezone
import boto3

ec2 = boto3.client("ec2")
s3 = boto3.client("s3")

TAG_KEY = os.getenv("TAG_KEY", "GuardDuty")
TAG_VALUE = os.getenv("TAG_VALUE", "suspected")
S3_BUCKET = os.getenv("S3_BUCKET", "")
LOG_ONLY = os.getenv("LOG_ONLY", "false").lower() == "true"
MIN_SEVERITY = float(os.getenv("MIN_SEVERITY", "0"))

def _put_to_s3(finding_id: str, payload: dict):
    if not S3_BUCKET:
        return
    key = f"guardduty/findings/{finding_id}_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    s3.put_object(
        Bucket=S3_BUCKET,
        Key=key,
        Body=(json.dumps(payload, ensure_ascii=False, indent=2)).encode("utf-8"),
        ContentType="application/json"
    )
    print(f"[evidence] finding saved to s3://{S3_BUCKET}/{key}")

def _tag_ec2(instance_id: str):
    if LOG_ONLY:
        print(f"[tag] LOG_ONLY=true, skip tagging {instance_id}")
        return
    ec2.create_tags(
        Resources=[instance_id],
        Tags=[{"Key": TAG_KEY, "Value": TAG_VALUE}]
    )
    print(f"[tag] EC2 {instance_id} tagged: {TAG_KEY}={TAG_VALUE}")

def lambda_handler(event, context):
    results = []
    for rec in event.get("Records", []):
        sns_msg = rec.get("Sns", {}).get("Message", "{}")
        try:
            matched_event = json.loads(sns_msg)
        except json.JSONDecodeError:
            print("[warn] SNS message is not JSON, raw:", sns_msg[:200])
            continue

        detail = matched_event.get("detail", {})
        finding_type = detail.get("type", "unknown")
        finding_id = detail.get("id", detail.get("findingId", "no-id"))
        severity = float(detail.get("severity", 0))
        region = matched_event.get("region", "unknown")
        account = matched_event.get("account", "unknown")
        instance_id = (
            detail.get("resource", {})
                  .get("instanceDetails", {})
                  .get("instanceId")
        )

        print(f"[finding] id={finding_id} type={finding_type} sev={severity}")

        try:
            _put_to_s3(finding_id, matched_event)
        except Exception as e:
            print(f"[evidence] failed to write S3: {e}")

        if severity < MIN_SEVERITY:
            print(f"[skip] severity {severity} < MIN_SEVERITY {MIN_SEVERITY}")
            results.append({"findingId": finding_id, "action": "skipped"})
            continue

        if instance_id:
            try:
                _tag_ec2(instance_id)
                action = "tagged_ec2"
            except Exception as e:
                print(f"[tag] failed to tag {instance_id}: {e}")
                action = "tag_failed"
        else:
            action = "no_ec2_in_finding"

        results.append({
            "findingId": finding_id,
            "type": finding_type,
            "severity": severity,
            "instanceId": instance_id,
            "action": action
        })
    return {"ok": True, "results": results}`;
