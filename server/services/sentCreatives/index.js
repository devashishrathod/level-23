const { sendSentCreatives } = require("./sendSentCreatives");
const { getSentCreative } = require("./getSentCreative");
const { getAllSentCreatives } = require("./getAllSentCreatives");
const { deleteSentCreative } = require("./deleteSentCreative");

module.exports = {
  sendSentCreatives,
  getSentCreative,
  getAllSentCreatives,
  deleteSentCreative,
};
