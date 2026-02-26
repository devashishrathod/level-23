const DemandLetter = require("../../models/DemandLetter");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");
const { UNIT_STATUS, DEMAND_LETTER_PAYMENT_STATUS } = require("../../constants");

const calculate = (totalConsideration, breakup, gst, amountReceived) => {
  const total = Number(totalConsideration);
  const items = (breakup || []).map((i) => {
    const pct = Number(i.percentage || 0);
    const amount = (total * pct) / 100;
    return { title: i.title, percentage: pct, amount };
  });

  const sgstPct = Number(gst?.sgstPercentage || 0);
  const cgstPct = Number(gst?.cgstPercentage || 0);

  const sgstAmount = (total * sgstPct) / 100;
  const cgstAmount = (total * cgstPct) / 100;
  const totalGstAmount = sgstAmount + cgstAmount;

  const totalPayable = total + totalGstAmount;
  const received = Number(amountReceived || 0);
  const dueAmount = Math.max(0, totalPayable - received);

  return {
    considerationBreakup: items,
    gst: {
      sgstPercentage: sgstPct,
      cgstPercentage: cgstPct,
      sgstAmount,
      cgstAmount,
      totalGstAmount,
    },
    totalPayable,
    amountReceived: received,
    dueAmount,
    paymentStatus:
      dueAmount <= 0 ? DEMAND_LETTER_PAYMENT_STATUS.PAID : DEMAND_LETTER_PAYMENT_STATUS.PENDING,
  };
};

exports.updateDemandLetter = async (id, payload) => {
  validateObjectId(id, "DemandLetter Id");

  const doc = await DemandLetter.findById(id);
  if (!doc || doc.isDeleted) throwError(404, "Demand letter not found");

  payload = payload || {};

  const nextUnitId = payload?.property?.unitId || doc?.property?.unitId;
  validateObjectId(nextUnitId, "Unit Id");

  const unit = await Unit.findOne({ _id: nextUnitId, isDeleted: false });
  if (!unit) throwError(404, "Unit not found");
  if (unit.status === UNIT_STATUS.SOLD) {
    throwError(400, "Demand letter cannot be linked to sold unit");
  }

  if (payload.customer) {
    doc.customer = { ...(doc.customer || {}), ...payload.customer };
  }

  if (payload.property) {
    doc.property = { ...(doc.property || {}), ...payload.property };
  }

  if (typeof payload.totalConsideration !== "undefined") {
    doc.totalConsideration = Number(payload.totalConsideration);
  }

  if (typeof payload.amountReceived !== "undefined") {
    doc.amountReceived = Number(payload.amountReceived);
  }

  const breakup = payload.considerationBreakup || doc.considerationBreakup;
  const gst = payload.gst || doc.gst;

  const computed = calculate(doc.totalConsideration, breakup, gst, doc.amountReceived);

  doc.considerationBreakup = computed.considerationBreakup;
  doc.gst = computed.gst;
  doc.totalPayable = computed.totalPayable;
  doc.dueAmount = computed.dueAmount;

  if (typeof payload.paymentStatus !== "undefined") {
    doc.paymentStatus = payload.paymentStatus;
  } else {
    doc.paymentStatus = computed.paymentStatus;
  }

  if (typeof payload.isActive !== "undefined") doc.isActive = payload.isActive;

  doc.updatedAt = new Date();

  try {
    await doc.save();
    return doc;
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Demand letter already exists for this unit and date");
    }
    throw err;
  }
};
