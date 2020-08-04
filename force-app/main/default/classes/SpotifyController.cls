public with sharing class SpotifyController {

    public static String permission(String Token){
        List<Access_Token__c> aT = new List<Access_Token__c>();
        aT = [SELECT Token__c FROM Access_Token__c LIMIT 1];
        aT[0].Token__c = Token; 
        upsert aT;
        return 'true';
    }
    
}