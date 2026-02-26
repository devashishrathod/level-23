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

exports.createDemandLetter = async (payload) => {
  payload = payload || {};

  const unitId = payload?.property?.unitId;
  validateObjectId(unitId, "Unit Id");

  const unit = await Unit.findOne({ _id: unitId, isDeleted: false });
  if (!unit) throwError(404, "Unit not found");
  if (unit.status === UNIT_STATUS.SOLD) {
    throwError(400, "Demand letter cannot be created for sold unit");
  }

  const computed = calculate(
    payload.totalConsideration,
    payload.considerationBreakup,
    payload.gst,
    payload.amountReceived,
  );

  const docPayload = {
    customer: payload.customer,
    property: payload.property,
    totalConsideration: Number(payload.totalConsideration),
    considerationBreakup: computed.considerationBreakup,
    gst: computed.gst,
    totalPayable: computed.totalPayable,
    amountReceived: computed.amountReceived,
    dueAmount: computed.dueAmount,
    paymentStatus: payload.paymentStatus || computed.paymentStatus,
    isActive: payload.isActive,
  };

  try {
    return await DemandLetter.create(docPayload);
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Demand letter already exists for this unit and date");
    }
    throw err;
  }
};
