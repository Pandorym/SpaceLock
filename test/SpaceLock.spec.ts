import { equal } from 'assert';
import { SpaceLock } from '../src';

describe('SpaceLock - default options', function() {

    it('should can create spaceLock', function() {
        let spaceLock = new SpaceLock('KEY1');
        equal(spaceLock.key, 'KEY1');
        equal(spaceLock.spaceSize, 1);
        equal(spaceLock.currentNumber, 0);
        equal(spaceLock.waitTaskQueue.length, 0);
    });


    it(`should can checkIn, when there's no one in it.`, (done) => {
        let spaceLock = new SpaceLock('KEY2');
        spaceLock.checkIn()
                 .then(() => {
                     done();
                 });
    });

    it(`should isFull = true, when there's 1 in there.`, (done) => {
        let spaceLock = new SpaceLock('KEY3');
        spaceLock.checkIn();

        try {
            equal(spaceLock.isFull, true);
            done();
        }
        catch (e) {
            done(e);
        }
    });

    it(`should isLocked = true, when there's 1 in there.`, (done) => {
        let spaceLock = new SpaceLock('KEY4');
        spaceLock.checkIn();

        try {
            equal(spaceLock.isLocked, true);
            done();
        }
        catch (e) {
            done(e);
        }
    });


    it(`should dont checkIn, when there's 1 in there.`, (done) => {
        let spaceLock = new SpaceLock('KEY5');
        spaceLock.checkIn();
        spaceLock.checkIn()
                 .then(() => {
                     done('passed');
                 });
        done();
    });

    it(`should can checkIn, when there's 1 in there, And then leave.`, (done) => {
        let spaceLock = new SpaceLock('KEY6');
        spaceLock.checkIn()
                 .then(() => {
                     spaceLock.checkOut();
                 });
        spaceLock.checkIn()
                 .then(() => {
                     done();
                 });
    });


    it(`should can checkIn, after doOnce`, (done) => {
        let spaceLock = new SpaceLock('KEY7');
        spaceLock
            .doOnce(async () => {
                // To do something
            })
            .then(() => {
                spaceLock.checkIn()
                         .then(() => {
                             done();
                         });
            });
    });

    it(`should return 1 + 1 = 2, after doOnce`, (done) => {
        let spaceLock = new SpaceLock('KEY8');
        spaceLock
            .doOnce(async () => {
                return 1 + 1;
            })
            .then((result) => {
                equal(result, 2);
                done();
            });
    });


    it(`should one by one, when has multiple wait`, (done) => {
        let spaceLock = new SpaceLock('KEY9');

        let last = 0;

        spaceLock.doOnce(() => {
            equal(last, 0);
            last = 1;
        });

        spaceLock.doOnce(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        equal(last, 1);
                    }
                    catch (e) {
                        done(e);
                    }

                    last = 2;
                    resolve();
                }, 500);
            });
        });


        spaceLock.doOnce(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        equal(last, 2);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }

                    last = 3;
                    resolve();
                }, 100);
            });
        });
    });

    it('should one by one, when has multiple wait - 1000 times', function(done) {
        let spaceLock = new SpaceLock('KEY10');

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


    it('should one by one, when has multiple wait - 1000 times Promise', function(done) {
        let spaceLock = new SpaceLock('KEY11');
        let last = -1;

        for (let i = 0; i <= 1000; i++) {
            spaceLock.doOnce(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                            equal(last, i - 1);
                        }
                        catch (e) {
                            done(e);
                        }
                        last = i;
                        resolve();
                    }, 1);
                });
            });
        }

        spaceLock.doOnce(() => {
            equal(last, 1000);
            done();
        });

    });

    it('should throw reject, when doOnce timeout', function(done) {
        let spaceLock = new SpaceLock('KEY11');

        spaceLock
            .doOnce(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            }, 500)
            .then(() => {
                done('into then');
            })
            .catch(done);

    });

    it('should into then, when doOnce not timeout', function(done) {
        let spaceLock = new SpaceLock('KEY11');

        spaceLock
            .doOnce(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 500);
                });
            }, 1500)
            .then(() => {
                done();
            })
            .catch(() => {
                done('into catch');
            });

    });
});
