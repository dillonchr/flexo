const test = require('tape');
const r = require('../../routes/reminders/reminder-manager.js');
const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

test('reminder manager', t => {
    t.plan(1);
    t.equal(!!r, true);
});

test('reminder manager date parsing', t => {
    const now = new Date();
    const result = r.extractDate(`haircut ${months[now.getMonth()]} ${now.getDate() + 1}`);
    t.equal(result.getMonth(), now.getMonth());
    t.equal(result.getDate(), now.getDate() + 1);
    t.equal(result.getMinutes(), 0);
    t.equal(result.getHours(), 8);
    const nextMo = Math.min(11, now.getMonth() + 1);
    const result2 = r.extractDate(`mow lawn ${months[nextMo]}`);
    t.equal(result2.getMonth(), nextMo);
    t.equal(result2.getDate(), 1);
    const result3 = r.extractDate(`amz prime ${months[now.getMonth()]} ${now.getDate()} 1:00`);
    t.equal(result3.getFullYear(), now.getFullYear() + 1);
    t.equal(result3.getHours(), 13);
    const result4 = r.extractDate(`amz prime ${months[now.getMonth()]} ${now.getDate()} 1:00am`);
    t.equal(result4.getHours(), 1);
    const result5 = r.extractDate(`amz prime ${months[now.getMonth()]} ${now.getDate()} 01:00`);
    t.equal(result5.getHours(), 1);
    t.end();
});

test('reminder manager date parse days of the week', t => {
    const result = r.extractRelativeDate('crash bandicoot Sunday @ 6');
    t.deepLooseEqual(result, ['Sunday', '6']);
    const date = r.toAbsoluteDate(['Sunday', '6']);
    t.equals(date.getMonth() >= new Date().getMonth(), true);
    t.equals(date.getHours(), 18);
    t.end();
});
