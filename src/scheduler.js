const schedule = require('node-schedule');
import {runMonthlyRanking} from "./services/rankCliend"

// ... (Code hàm calculateSongScore, compareRankingWithPreviousMonth, createMonthlyRankingPlaylist như trước)

// Lập lịch cho hàm runMonthlyRanking chạy vào đầu mỗi tháng
const rule = new schedule.RecurrenceRule();
rule.hour = 0; // Chạy lúc 0 giờ (giờ địa phương)
rule.minute = 0; // Chạy lúc 0 phút
rule.dayOfMonth = 1; // Chạy vào ngày 1 của mỗi tháng
rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Chạy cho tất cả các tháng
const startScheduler = () => {
    let job; // Khai báo biến job
    if (job) {
        job.cancel(); // Nếu đã có job đang chạy, hủy job cũ
    }

    job = schedule.scheduleJob(rule, async () => {
        console.log('Bắt đầu tạo playlist bảng xếp hạng tháng...');
        await runMonthlyRanking();
        console.log('Tạo playlist thành công!');
    });
};

module.exports = {
    startScheduler,
};