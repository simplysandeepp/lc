class Solution {
    public String mapWordWeights(String[] words, int[] weights) {
        StringBuilder res = new StringBuilder();

        for(String word : words)  {
            int sum =0;
            for(char ch : word.toCharArray()) {
                sum += weights[ch-'a'];
            }
            int v = sum%26;
            char mapping = (char) ('z'-v);
            res.append(mapping);
        }
        return res.toString();
    }
}