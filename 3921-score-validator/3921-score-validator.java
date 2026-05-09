class Solution {
    public int[] scoreValidator(String[] events) {
        int s=0;
        int c=0;
        for(String e : events) {
            if(c==10) break;
            if(e.equals("W")){
                c++;
            }
            else if(e.equals("WD") || e.equals("NB")) {
                s+=1;
            } else {
                s += Integer.parseInt(e);
            }
        }
        return new int[]{s,c};
    }
}