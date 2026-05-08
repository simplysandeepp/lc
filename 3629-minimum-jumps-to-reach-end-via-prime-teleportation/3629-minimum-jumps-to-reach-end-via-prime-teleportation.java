class Solution {

    public int minJumps(int[] nums) {

        int n = nums.length;

        if (n == 1) return 0;

        // maximum number find kar rahe
        int max = 1;

        for (int x : nums) {
            max = Math.max(max, x);
        }

        // smallest prime factor array
        int[] spf = buildSPF(max);

        // prime -> list of indexes
        Map<Integer, List<Integer>> map = new HashMap<>();


        // har number ke prime factors nikal rahe
        for (int i = 0; i < n; i++) {

            int val = nums[i];

            while (val > 1) {

                int prime = spf[val];

                map.putIfAbsent(prime, new ArrayList<>());
                map.get(prime).add(i);

                // duplicate prime hata do
                while (val % prime == 0) {
                    val /= prime;
                }
            }
        }


        Queue<Integer> q = new LinkedList<>();
        boolean[] vis = new boolean[n];

        q.offer(0);
        vis[0] = true;

        int jumps = 0;


        // BFS
        while (!q.isEmpty()) {

            int size = q.size();

            while (size-- > 0) {

                int idx = q.poll();

                // destination mil gaya
                if (idx == n - 1) {
                    return jumps;
                }

                // left jump
                if (idx - 1 >= 0 && !vis[idx - 1]) {

                    vis[idx - 1] = true;
                    q.offer(idx - 1);
                }

                // right jump
                if (idx + 1 < n && !vis[idx + 1]) {

                    vis[idx + 1] = true;
                    q.offer(idx + 1);
                }


                // prime wala jump
                int val = nums[idx];

                // sirf prime number ke liye
                if (val >= 2 && spf[val] == val) {

                    List<Integer> nextIndexes = map.get(val);

                    if (nextIndexes != null) {

                        for (int next : nextIndexes) {

                            if (!vis[next]) {

                                vis[next] = true;
                                q.offer(next);
                            }
                        }
                    }

                    // dubara same prime process na ho
                    map.remove(val);
                }
            }

            jumps++;
        }

        return -1;
    }



    // smallest prime factor
    public int[] buildSPF(int max) {

        int[] spf = new int[max + 1];

        for (int i = 2; i <= max; i++) {

            // already filled
            if (spf[i] != 0) continue;

            spf[i] = i;

            for (long j = (long)i * i; j <= max; j += i) {

                if (spf[(int)j] == 0) {
                    spf[(int)j] = i;
                }
            }
        }

        return spf;
    }
}