const Rewarded = require("../models/Rewarded");
const RewardedDetail = require("../models/RewardedDetail");
const BonusItem = require("../models/BonusItem");
const User = require("../models/User");

// Hàm để người dùng chọn vật thưởng
async function chooseReward(req, res) {
  try {
    const { userId, bonusItemId } = req.body;

    const rewarded = new Rewarded({
      userId: userId,
    });

    // Kiểm tra xem rewardedId và bonusItemId có tồn tại hay không
    // Ví dụ:
    const bonusItem = await BonusItem.findById(bonusItemId);

    if (!bonusItem) {
      return res
        .status(404)
        .json({ message: "Invalid rewardedId or bonusItemId" });
    }

    // Lấy thông tin người dùng
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Invalid userId" });
    }

    // Kiểm tra điểm người dùng
    if (user.point < bonusItem.point) {
      return res
        .status(400)
        .json({ message: "Insufficient points to choose this bonus item" });
    } else {
      // Lưu thông tin vật thưởng đã được chọn
      await rewarded.save();
      const rewardedDetail = new RewardedDetail({
        rewardedId: rewarded._id,
        bonusItemId: bonusItemId,
      });
      await rewardedDetail.save();

      res.json({ message: "Bonus item selected successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to select bonus item" });
  }
}

// Hàm để hiển thị danh sách thưởng
async function getRewards(req, res) {
  try {
    const rewards = await RewardedDetail.find()
      .populate({
        path: "rewardedId",
        select: "userId bonusDate",
      })
      .populate({
        path: "bonusItemId",
        select: "name",
      })
      .select("rewardedId bonusItemId");

    res.json(rewards);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  chooseReward,
  getRewards,
};
