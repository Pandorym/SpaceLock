import { equal } from 'assert';
import { SpaceLock } from '../src';

describe('SpaceLock - options: spaceSize', function() {

    it('should can create spaceLock with spaceSize.', function() {
        let spaceLock = new SpaceLock('KEY1', { spaceSize : 20 });
        equal(spaceLock.key, 'KEY1');
        equal(spaceLock.spaceSize, 20);
        equal(spaceLock.currentNumber, 0);
        equal(spaceLock.waitTaskQueue.length, 0);
    });

    it('should one by one, when More than spaceSize, And has multiple wait - 1000 times.', function(done) {
        let spaceLock = new SpaceLock('KEY2', { spaceSize : 20 });

        let last = -1;
        for (let i = 0; i <= 1000; i++) {
            spaceLock.doOnce(() => {
                try {
                    equal(last, i - 1);
                }
                catch (e) {
                    done(e);
                }
                last = i;
            });
        }

        spaceLock.doOnce(() => {
            equal(last, 1000);
            done();
        });
    });
});
