import { createJiti } from 'jiti';

(async () => {
    createJiti(__filename)(`./${process.argv[2]}/solution.ts`);
})();
