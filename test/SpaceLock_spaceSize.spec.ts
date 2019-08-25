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


    it('should last = 981, when spaceSize = 20, And has multiple wait - 1000 times Promise.', function(done) {
        let spaceLock = new SpaceLock('KEY3', { spaceSize : 20 });

        let i = 0;
        for (; i < 20; i++) {
            spaceLock.doOnce(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 1);
                });
            });
        }


        let last = i - 1;

        for (let j = i; j <= 1000; j++) {
            spaceLock.doOnce(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                            equal(last, j - 1);
                        }
                        catch (e) {
                            done(e);
                        }
                        last = j;
                        resolve();
                    }, 1);
                });
            });
        }

        spaceLock.doOnce(() => {
            try {
                equal(last, 1000 + 1 - 20);
                done();
            }
            catch (e) {
                done(e);
            }
        });

    });
});
