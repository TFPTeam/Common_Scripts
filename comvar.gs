include "commonscripts.gs"

static class Comvar
{
    public define int TDL_ON = 1;
    public define int TDL_PAUSE = 0;  
    public define int TDL_OFF = -1;  
    public define int TDL_OUT = -2;   
    
    public Soup o_WclassRoot = Constructors.NewSoup();
    public Soup o_LclassRoot = Constructors.NewSoup(); 
    public Soup o_systemsData = Constructors.NewSoup();  

    public bool db_Init;
    
    public void Init()
    {
        bool log=false;
        o_LclassRoot.SetNamedTag("x6x", "263;263p");
        o_WclassRoot.SetNamedTag("y", "A149;A151;B249;B251;Bd264;AB349;BDsee454;Bc833;Ds952;Ds953");
        o_WclassRoot.SetNamedTag("y/b", "A150;AB350;Bee272"); 
        o_WclassRoot.SetNamedTag("x", ""); 
        o_WclassRoot.SetNamedTag("studenka", "Bdt279;Bdt280;Bp282"); 
        o_WclassRoot.SetNamedTag("l", "Btax780");         
        
        o_systemsData.SetNamedTag("263", "25kV");
        o_systemsData.SetNamedTag("263p", "25kV");
        
        if(log) Interface.Log("Comvar.Init()");
        db_Init=true;    
    }
    
    public string GetRootDirectory(string vehicle, string vehicle_class)
    {
        bool log=false;
        
        if(log) Interface.Log("Comvar.GetRootDirectory("+vehicle+", "+vehicle_class+")");
        int t,s;
        if(log) Interface.Log("  browsing defined classes...");
        
        Soup Root;
        if(vehicle == "locomotive" or vehicle == "loco") Root = o_LclassRoot;
        else if(vehicle == "wagon") Root = o_WclassRoot;
        
        
        for(t=0; t < Root.CountTags(); t++)
        {
            string [] classes = Str.Tokens(Root.GetNamedTag(Root.GetIndexedTagName(t)),";"); 
            string browser_root = Root.GetIndexedTagName(t);
            for(s=0; s < classes.size(); s++)
            {
                if(log) Interface.Log("     "+classes[s]+" ?=? "+vehicle_class+" <- "+Root.GetIndexedTagName(t));
                
                if(vehicle_class == classes[s])
                {                   
                    string root = Root.GetIndexedTagName(t);
                    if(root == "y/b" or root == "Y/B") root="y";
                    if(root == "studenka" or root == "Studenka") root="sdk";
                    Interface.Log("        vehicle is loading asset from dir: "+root);
                    return root;
                }            
            }
        } 
        
        if(log) Interface.Log("  root directory for this vehicle was not found!");         
        return "";
    }
    
    public string [] GetVoltageSystems(string loco_class)
    {
        bool log=false;
        
        if(log) Interface.Log("Comvar.GetVoltageSystems("+loco_class+")"); 
           
        int s;
        
        string [] voltages = Str.Tokens(o_systemsData.GetNamedTag(loco_class), ";");
        
        for(s=0; s < voltages.size(); s++)
        {
            Interface.Log("  adding voltage system: "+voltages[s]);
            //array[array.size()] = Str.CloneString(voltages[s]);
        }
        
        return voltages;
    }
};
