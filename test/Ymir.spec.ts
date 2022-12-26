import { equal } from 'assert';
import {SpaceLock, Ymir} from '../src';
import {Promise} from "bluebird";

describe('Ymir - default options', function() {

    let ymir = new Ymir();

    it('should can create spaceLock', function () {
        ymir.getSpaceLock('KEY1');
        equal(ymir.getSpaceLock('KEY1').key, 'KEY1');
        equal(ymir.getSpaceLock('KEY1').spaceSize, 1);
        equal(ymir.getSpaceLock('KEY1').currentNumber, 0);
        equal(ymir.getSpaceLock('KEY1').waitTaskQueue.length, 0);
    });


    it(`should can checkIn, when there's no one in it.`, (done) => {
        ymir.getSpaceLock('KEY2').checkIn()
            .then(() => {
                done();
            });
    });

    it(`should isFull = true, when there's 1 in there.`, (done) => {
        ymir.checkIn('KEY3');

        try {
            equal(ymir.isFull('KEY3'), true);
            done();
        } catch (e) {
            done(e);
        }
    });

    it(`should isLocked = true, when there's 1 in there.`, (done) => {
        ymir.checkIn('KEY4');

        try {
            equal(ymir.isLocked('KEY4'), true);
            done();
        } catch (e) {
            done(e);
        }
    });


    it(`should dont checkIn, when there's 1 in there.`, (done) => {
        ymir.checkIn('KEY5');
        ymir.checkIn('KEY5')
            .then(() => {
                done('passed');
            });
        done();
    });

    it(`should can checkIn, when there's 1 in there, And then leave.`, (done) => {
        ymir.checkIn('KEY6')
            .then(() => {
                ymir.checkOut('KEY6');
            });
        ymir.checkIn('KEY6')
            .then(() => {
                done();
            });
    });


    it(`should can checkIn, after doOnce`, (done) => {
        ymir
            .doOnce('KEY7', async () => {
                // To do something
            })
            .then(() => {
                ymir.checkIn('KEY7')
                    .then(() => {
                        done();
                    });
            });
    });

    it(`should return 1 + 1 = 2, after doOnce`, (done) => {
        ymir
            .doOnce('KEY8', async () => {
                return 1 + 1;
            })
            .then((result) => {
                equal(result, 2);
                done();
            });
    });


    it(`should one by one, when has multiple wait`, (done) => {
        let last = 0;

        ymir.doOnce('KEY9', () => {
            equal(last, 0);
            last = 1;
        });

        ymir.doOnce('KEY9', () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        equal(last, 1);
                    } catch (e) {
                        done(e);
                    }

                    last = 2;
                    resolve();
                }, 500);
            });
        });


        ymir.doOnce('KEY9', () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        equal(last, 2);
                        done();
                    } catch (e) {
                        done(e);
                    }

                    last = 3;
                    resolve();
                }, 100);
            });
        });
    });

    it('should one by one, when has multiple wait - 1000 times', function (done) {
        let last = -1;
        for (let i = 0; i <= 1000; i++) {
            ymir.doOnce('KEY10', () => {
                try {
                    equal(last, i - 1);
                } catch (e) {
                    done(e);
                }
                last = i;
            });
        }

        ymir.doOnce('KEY10', () => {
            equal(last, 1000);
            done();
        });
    });


    it('should one by one, when has multiple wait - 1000 times Promise', function (done) {
        let last = -1;

        for (let i = 0; i <= 1000; i++) {
            ymir.doOnce('KEY11', () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                            equal(last, i - 1);
                        } catch (e) {
                            done(e);
                        }
                        last = i;
                        resolve();
                    }, 1);
                });
            });
        }

        ymir.doOnce('KEY11', () => {
            equal(last, 1000);
            done();
        });

    });

    it('should throw reject, when doOnce timeout', function (done) {
        ymir
            .doOnce('KEY12', () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            }, 500)
            .then(() => {
                done('into then');
            })
            .catch(() => {
                done();
            });

    });

    it('should into then, when doOnce not timeout', function (done) {
        ymir
            .doOnce('KEY13', () => {
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

    it('should try again and again, until one done', function (done) {
        let canDone = false;

        setTimeout(() => {
            canDone = true;
        }, 1100);

        ymir
            .doOnce_untilOneDone('KEY14', () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (canDone) resolve();
                        else reject();
                    }, 200);
                });
            })
            .then(() => {
                done();
            })
            .catch(() => {
                done('into catch');
            });

    });

    it('should try again and again, until one done, with timeout option - but never go to then', function (done) {
      let canDone = false;
      setTimeout(() => canDone = true, 1100);

      Promise
        .race([
          ymir
            .doOnce_untilOneDone('KEY15', () => {
              return new Promise((resolve, reject) => {
                let num = 0;
                setTimeout(() => resolve(num), canDone ? 200 : 500);
              });
            }, 300),
          new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), 1000))]
        )
        .then(() => {
          done('into then');
        })
        .catch(() => {
          done();
        });
    });

    it('should try again and again, until exceeded try times - go to catch', function (done) {
      let canDone = false;
      setTimeout(() => canDone = true, 1100);

      Promise
        .race([
          ymir
            .doOnce_untilOneDone('KEY16', () => {
              return new Promise((resolve, reject) => {
                let num = 0;
                setTimeout(() => resolve(num), canDone ? 200 : 500);
              });
            }, 300, 2),
          new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), 1000))]
        )
        .then(() => {
          done('into then');
        })
        .catch(() => {
          done();
        });
    });

  it('needOneCheckout - should wait exist task done, and get it', async function () {
    let key = 'KEY17';

    ymir.doOnce(key,async () => 1 + 1).then()

    let result = await ymir.needOneCheckout(key, async () =>  2 + 2)

    equal(result.result, 2)
  });

  it('needOneCheckout - with specially task_key', async function () {
    let key = 'KEY18';

    let order_task_key_list: Array<any> = []
    let result_promise_list = []

    for (let i = 0; i < 30; i ++) {
      result_promise_list.push(ymir.needOneCheckout(key, async () => 1, i % 3).then(task => order_task_key_list.push(task.key)));
    }

    await Promise.all(result_promise_list)

    equal(order_task_key_list.length, 30);
    equal(order_task_key_list.splice(0, 10).filter(x => x === 0).length, 10);
    equal(order_task_key_list.splice(0, 10).filter(x => x === 1).length, 10);
    equal(order_task_key_list.splice(0, 10).filter(x => x === 2).length, 10);
  });
});
