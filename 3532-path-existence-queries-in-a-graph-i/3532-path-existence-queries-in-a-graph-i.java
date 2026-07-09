class Solution {
    public boolean[] pathExistenceQueries(int n, int[] nums, int maxDiff, int[][] q) {
        int x = q.length;
        int y= nums.length;
        boolean[] ans = new boolean[x];
        int[] root = new int[y];

        root[0] = 0;

        for (int i = 1; i < y; i++) {
            if ((nums[i] - nums[i - 1]) <= maxDiff) {
                root[i] = root[i - 1];
            } else {
                root[i] = i;
            }
        }

        for (int i = 0; i < x; i++) {
            int u = q[i][0];
            int v = q[i][1];
            ans[i] = (root[u] == root[v]);
        }

        return ans;
    }
}