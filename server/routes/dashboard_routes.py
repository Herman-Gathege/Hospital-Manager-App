from flask import Blueprint, jsonify
from models import db, Patient, Billing, Appointment, Inventory, MedicalRecord, Staff
from utils.auth_middleware import token_required
from collections import defaultdict


dashboard_bp = Blueprint('dashboard', __name__)

# Dashboard Overview Route
@dashboard_bp.route('/overview', methods=['GET'])
@token_required
def dashboard_overview(current_user):
    total_patients = Patient.query.count()
    total_appointments = Appointment.query.count()
    total_bills = Billing.query.count()
    total_inventory_items = Inventory.query.count()
    total_staff = Staff.query.count()

    overview = {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "total_bills": total_bills,
        "total_inventory_items": total_inventory_items,
        "total_staff": total_staff
    }

    return jsonify(overview), 200



# Patient Statistics Route
@dashboard_bp.route('/patient_stats', methods=['GET'])
@token_required
def patient_stats(current_user):
    male_count = Patient.query.filter_by(gender="Male").count()
    female_count = Patient.query.filter_by(gender="Female").count()
    recent_patients = Patient.query.order_by(Patient.check_in_date.desc()).limit(5).all()

    recent_patients_list = [
        {"id": p.id, "name": f"{p.first_name} {p.last_name}", "check_in_date": p.check_in_date.isoformat()}
        for p in recent_patients
    ]

    stats = {
        "male_count": male_count,
        "female_count": female_count,
        "recent_patients": recent_patients_list
    }

    return jsonify(stats), 200



# Appointment Statistics Route
@dashboard_bp.route('/appointment_stats', methods=['GET'])
@token_required
def appointment_stats(current_user):
    scheduled_count = Appointment.query.filter_by(status="scheduled").count()
    completed_count = Appointment.query.filter_by(status="completed").count()
    canceled_count = Appointment.query.filter_by(status="canceled").count()

    stats = {
        "scheduled_count": scheduled_count,
        "completed_count": completed_count,
        "canceled_count": canceled_count
    }

    return jsonify(stats), 200



# Billing Statistics Route
# @dashboard_bp.route('/billing_stats', methods=['GET'])
# @token_required
# def billing_stats(current_user):
#     # total_due = db.session.query(db.func.sum(Billing.amount_due)).scalar() or 0.0
#     total_due = db.session.query(db.func.sum(Billing.total_amount_due)).scalar() or 0.0
#     total_paid = db.session.query(db.func.sum(Billing.amount_paid)).scalar() or 0.0
#     pending_count = Billing.query.filter_by(status="pending").count()
#     overdue_count = Billing.query.filter_by(status="overdue").count()

#     stats = {
#         "total_due": total_due,
#         "total_paid": total_paid,
#         "pending_count": pending_count,
#         "overdue_count": overdue_count
#     }

#     return jsonify(stats), 200

@dashboard_bp.route('/billing_stats', methods=['GET'])
@token_required
def billing_stats(current_user):
    # Summing up amounts for total due and paid
    total_due = db.session.query(db.func.sum(Billing.total_amount_due)).scalar() or 0.0
    total_paid = db.session.query(db.func.sum(Billing.amount_paid)).scalar() or 0.0
    pending_count = Billing.query.filter_by(status="pending").count()
    overdue_count = Billing.query.filter_by(status="overdue").count()

    # Get the paid bills and revenue by month
    paid_bills = Billing.query.filter_by(status="paid").all()
    revenue_by_month = defaultdict(float)
    
    for bill in paid_bills:
        month = bill.invoice_date.strftime("%Y-%m")  # Extract "YYYY-MM"
        revenue_by_month[month] += float(bill.amount_paid)
    
    # Prepare revenue data to include monthly revenue data
    revenue_data = [{"month": month, "revenue": revenue_by_month[month]} for month in sorted(revenue_by_month)]
    
    # Now, integrate the statistics along with the revenue data
    stats = {
        "total_due": total_due,
        "total_paid": total_paid,
        "pending_count": pending_count,
        "overdue_count": overdue_count,
        "revenue_by_month": revenue_data  # Added monthly revenue breakdown
    }

    return jsonify(stats), 200




# Inventory Statistics Route
@dashboard_bp.route('/inventory_stats', methods=['GET'])
@token_required
def inventory_stats(current_user):
    total_items = Inventory.query.count()
    low_stock_items = Inventory.query.filter(Inventory.quantity < 10).count()

    stats = {
        "total_items": total_items,
        "low_stock_items": low_stock_items
    }

    return jsonify(stats), 200
