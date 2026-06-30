from flask import Flask, render_template, jsonify
import boto3
import requests
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# ── AWS Configuration ──────────────────────────────────
AWS_REGION = "ap-south-1"
ASG_NAME = "cicd-pipeline-asg"
ALB_NAME = "cicd-pipeline-alb"
APP_HEALTH_URL = "http://cicd-pipeline-alb-1883555137.ap-south-1.elb.amazonaws.com/api/products/health"

# Initialize AWS clients
cloudwatch = boto3.client('cloudwatch', region_name=AWS_REGION)
autoscaling = boto3.client('autoscaling', region_name=AWS_REGION)
elbv2 = boto3.client('elbv2', region_name=AWS_REGION)
ec2 = boto3.client('ec2', region_name=AWS_REGION)


@app.route('/')
def dashboard():
    return render_template('index.html')


@app.route('/api/dashboard-data')
def dashboard_data():
    data = {
        'app_status': get_app_health(),
        'instance_count': get_instance_count(),
        'cpu_usage': get_cpu_metrics(),
        'instances': get_instance_details(),
        'asg_info': get_asg_info(),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    return jsonify(data)


def get_app_health():
    """Check if the Spring Boot app is responding"""
    try:
        response = requests.get(APP_HEALTH_URL, timeout=5)
        if response.status_code == 200:
            return {'status': 'healthy', 'message': response.text}
        return {'status': 'unhealthy', 'message': f'Status code: {response.status_code}'}
    except Exception as e:
        return {'status': 'down', 'message': str(e)}


def get_instance_count():
    """Get current Auto Scaling Group instance count"""
    try:
        response = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=[ASG_NAME]
        )
        if response['AutoScalingGroups']:
            asg = response['AutoScalingGroups'][0]
            return {
                'desired': asg['DesiredCapacity'],
                'min': asg['MinSize'],
                'max': asg['MaxSize'],
                'current': len(asg['Instances'])
            }
        return {'desired': 0, 'min': 0, 'max': 0, 'current': 0}
    except Exception as e:
        return {'error': str(e)}


def get_cpu_metrics():
    """Get average CPU utilization from CloudWatch for last 30 minutes"""
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(minutes=30)

        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[
                {'Name': 'AutoScalingGroupName', 'Value': ASG_NAME}
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=300,
            Statistics=['Average']
        )

        datapoints = sorted(response['Datapoints'], key=lambda x: x['Timestamp'])
        labels = [dp['Timestamp'].strftime('%H:%M') for dp in datapoints]
        values = [round(dp['Average'], 2) for dp in datapoints]

        return {'labels': labels, 'values': values}
    except Exception as e:
        return {'labels': [], 'values': [], 'error': str(e)}


def get_instance_details():
    """Get details of currently running instances"""
    try:
        response = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=[ASG_NAME]
        )
        instances = []
        if response['AutoScalingGroups']:
            for inst in response['AutoScalingGroups'][0]['Instances']:
                instances.append({
                    'id': inst['InstanceId'],
                    'state': inst['LifecycleState'],
                    'health': inst['HealthStatus'],
                    'az': inst['AvailabilityZone']
                })
        return instances
    except Exception as e:
        return []


def get_asg_info():
    """Get Auto Scaling Group general info"""
    try:
        response = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=[ASG_NAME]
        )
        if response['AutoScalingGroups']:
            asg = response['AutoScalingGroups'][0]
            return {
                'name': asg['AutoScalingGroupName'],
                'created': asg['CreatedTime'].strftime('%Y-%m-%d %H:%M'),
                'health_check_type': asg['HealthCheckType']
            }
        return {}
    except Exception as e:
        return {'error': str(e)}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)