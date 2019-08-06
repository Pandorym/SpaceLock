import { equal } from 'assert';
import { Locks } from '../src/Locks';

describe('Locks', function() {

    (<any>this).timeout(10000);
    this.slow(15000);

    let locks = new Locks();

    it('should has lock key', function() {
        let lock = locks.lock('KEY1');
        equal(lock.key, 'KEY1');
    });

    it('should has lock', (done) => {
        locks.lock('KEY2');
        locks.wait('KEY2')
             .then(() => {
                 equal(false, true);
             });

        setTimeout(done, 2000);
    });

    it('should can unlock', function(done) {
        locks.lock('KEY3');
        locks.wait('KEY3')
             .then(() => {
                 // do some thing
                 return new Promise((resolve) => {
                     setTimeout(resolve, 2000);
                 });
             })
             .then(() => {
                 equal(true, true);
                 done();
             });

        locks.unlock('KEY3');
    });
});
