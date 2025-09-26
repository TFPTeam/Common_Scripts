include "commonscripts.gs"

static class CM
{
    
//==============================================================================        
// Metody pro zjednodušení skriptování
//==============================================================================  
 
    public obsolete float CamVector(Locomotive op_Locomotive)
    {
        Interface.WarnObsolete("Method CamVector is obsolete, returned value 0.0. Use 'public bool TargetDistanceObject(MapObject, float, string)' instead.");
        return 0.0;
    }
    
    public Soup CallSoup(Soup Data, string primary)
    {
        Soup Empty = Constructors.NewSoup();
        
        
        if(Data.CountTags()==0)
        {
            Interface.Exception("CM.CallSoup(); Obtained 'Data' soup is empty!");
            return Empty;
        }
        
        Soup Check = Data.GetNamedSoup(primary);
        
        if(Check.CountTags()) return Check;
        
        Interface.Exception("CM.CallSoup(); Called soup of script "+Data.GetNamedTag("script")+" with parameters ("+primary+") is empty!");               
        Interface.LogCallStack("");   
        return Empty;
    }    
    
    public Soup CallSoup(Soup Data, string primary, string secondary)
    {
        Soup Empty = Constructors.NewSoup();
        
        if(Data.CountTags()==0)
        {
            Interface.Exception("CM.CallSoup(); Obtained 'Data' soup is empty!");
            return Empty;
        }        
        
        Soup Check = Data.GetNamedSoup(primary).GetNamedSoup(secondary);
        
        if(Check.CountTags()) return Check;
        
        Interface.Exception("CM.CallSoup(); Called soup of script "+Data.GetNamedTag("script")+" with parameters ("+primary+" < "+secondary+") is empty!");               
        Interface.LogCallStack("");   
        return Empty;
    }
    
    public Soup CallSoup(Soup Data, string primary, string secondary, string tertiary)
    {
        Soup Empty = Constructors.NewSoup();
        
        if(Data.CountTags()==0)
        {
            Interface.Exception("CM.CallSoup(); Obtained 'Data' soup is empty!");
            return Empty;
        }        
        
        Soup Check = Data.GetNamedSoup(primary).GetNamedSoup(secondary).GetNamedSoup(tertiary);
        
        if(Check.CountTags()) return Check;

        Interface.Exception("CM.CallSoup(); Called soup of script "+Data.GetNamedTag("script")+" with parameters ("+primary+" < "+secondary+" < "+tertiary+" is empty!");
        Interface.LogCallStack("");           

        return Empty;
    }  
    
    
    public Soup CallSoup(Soup Data, string primary, string secondary, string tertiary, string quaternary)
    {
        Soup Empty = Constructors.NewSoup();
        
        if(Data.CountTags()==0)
        {
            Interface.Exception("CM.CallSoup(); Obtained 'Data' soup is empty!");
            return Empty;
        }        
        
        Soup Check = Data.GetNamedSoup(primary).GetNamedSoup(secondary).GetNamedSoup(tertiary).GetNamedSoup(quaternary);
        
        if(Check.CountTags()) return Check;

        Interface.Exception("CM.CallSoup(); Called soup of script "+Data.GetNamedTag("script")+" with parameters ("+primary+" < "+secondary+" < "+tertiary+" < "+quaternary+" is empty!");
        Interface.LogCallStack("");           

        return Empty;
    }      
    
    //schopné pøijmout celý tag, ale i jen údaje o hlastiosti-fade
    public float GetFadedSoundDuration(string tag)
    {
        bool log=false;
        if(log) Interface.Log("CM.GetFadeDuration("+tag+")");
        string [] tokens = Str.Tokens(tag, ";"); 
        string [] values;
        if(tokens.size() > 1) values = Str.Tokens(tokens[2], "-");
        else values = Str.Tokens(tag, "-");       

        float duration;
         
        if(values.size() == 2) duration = Str.ToFloat(values[0]) - Str.ToFloat(values[1]);
        else duration = Str.ToFloat(values[0]);
            
        return duration;
    }
    
    public float GetCleanSoundDuration(string tag)
    {
        bool log=false;
        if(log) Interface.Log("CM.GetCleanSoundDuration("+tag+")");
        string [] tokens = Str.Tokens(tag, ";"); 
        string [] values;
        if(tokens.size() > 1) values = Str.Tokens(tokens[2], "-"); 
        else values = Str.Tokens(tag, "-"); 
        
        float duration;
         
        if(values.size() == 2) duration = Str.ToFloat(values[0]);
        else duration = Str.ToFloat(values[0]);
            
        return duration;    
    }
    
    public float GetFadeDuration(string tag)
    {
        bool log=false;
        if(log) Interface.Log("CM.GetFadeDuration("+tag+")");
        string [] tokens = Str.Tokens(tag, ";");        
        string [] values;
        
        if(tokens.size() > 1) values = Str.Tokens(tokens[2], "-");
        else values = Str.Tokens(tag, "-");          
  
        float duration;
         
        if(values.size() == 2) duration = Str.ToFloat(values[1]);
        else duration = 0.0;
            
        return duration;        
    }
    
    public float Power(float base, float power)
    {
        float result;
        
        int i;
        
        // 3 na 3
        result=base;
        float positive = Math.Abs(power);
        
        for(i=1; i < positive; i++)
        {           
            //Interface.Log("result: "+result+", positive: "+positive); 
            result = result * base; 
            //Interface.Log("result: "+result+", positive: "+positive);     
        }          
        
        if(power  < 0.0)
        {
            result = 1/result;
        }

        
        Interface.Log("CM.Power("+base+", "+power+") return "+result);
        return result;    
    }
    
    public int Factorial(int number)
    {
        int result=number;
        
        int i;
        for(i=number-1; i > 0; i--)
        {
            //Interface.Log("result: "+result+", i: "+i);  
            result = result*i; 
            //Interface.Log("result: "+result+", i: "+i);    
        }
        Interface.Log("CM.Factorial("+number+") return "+result);
        return result;
    }
    
 
    public Soup SortFloatSoup(Soup Data)
    {
        bool log=true;
        float min=1000.0;
        float min_sorted=0.0;
        Soup new_Data=Constructors.NewSoup();
        Interface.Log("*CM.SortFloatSoup*");
        /*
            napø.
            0.25    "v1"
            0.5     "v3"
            0.75    "v4"
            1.0     "v2"
        */
        int i=0;
        int y;
        string tag;
        float tag_to_float;
        string value;
        while(i<Data.CountTags())
        { 
            Interface.Log("  i: "+i);
            for(y=0; y < Data.CountTags(); y++)
            {      
                
                
                tag = Data.GetIndexedTagName(y);

                tag_to_float = Str.ToFloat(tag);
                    
                Interface.Log("  y: "+y+" -> tag: "+tag+"; tag_to_float: "+tag_to_float);           
                if(new_Data.CountTags()==0)
                {
                    Interface.Log("    zero tags");  
                    if(tag_to_float < min)
                    {
                        Interface.Log("      tag_to_float("+tag_to_float+") < min("+min+")");   
                        min = tag_to_float;  
                        value = Data.GetNamedTag(Data.GetIndexedTagName(y)); 
                        Interface.Log("      new min("+min+") -> value("+value+")");                          
                    }                            
                }
                else
                {
                    if(tag_to_float < min and tag_to_float > min_sorted)
                    {
                        Interface.Log("      tag_to_float("+tag_to_float+") < min("+min+") and tag_to_float("+tag_to_float+") > min_sorted("+min_sorted+")");   
                        min = tag_to_float; 
                        value = Data.GetNamedTag(Data.GetIndexedTagName(y));   
                        Interface.Log("      new min("+min+") -> value("+value+")"); 
                    }                    
                }            
            }
            min_sorted = min;
            min=1000.0;
            string new_tag = min_sorted;
            Str.Left(new_tag,4);
            new_Data.SetNamedTag(new_tag, value);
            i++; 
            Interface.Log("  end of iteration: reseting min to 1000.0, min_sorted: "+min_sorted+" | new_tag: "+new_tag+"..."+value);            
        }

        if(log)
        {            
            for(i=0; i < new_Data.CountTags(); i++)
            {
                Interface.Log(new_Data.GetIndexedTagName(i)+"..."+new_Data.GetNamedTag(new_Data.GetIndexedTagName(i)));
            }                    
        }
        return new_Data;    
    } 
    
    public float [] SortFloatArray(float [] array)
    {
        bool log=true;
        float min=1000.0;
        float min_sorted=0.0;
        float [] sorted = new float [0];

        // napø. 6, 3, 1, 8, 4
        int i=0;
        int y;
        while(i<array.size())
        {
            
            for(y=0; y < array.size(); y++)
            {      
                if(sorted.size()==0)
                {
                    if(array[y] < min)
                    {
                        min = array[y];     
                    }                            
                }
                else
                {
                    if(array[y] < min and array[y] > min_sorted)
                    {
                        min = array[y];     
                    }                    
                }            
            }
            min_sorted = min;
            min=1000.0;
            sorted[sorted.size()] = min_sorted;  
            i++;             
        }
        
        string check="";
        if(log)
        {            
            for(i=0; i < sorted.size(); i++)
            {
                if(i==(sorted.size()-1)) check=check+sorted[i]; 
                else check=check+sorted[i]+", "; 
            }                    
        }
        if(log) Interface.Log("CM(SortFloatArray): "+check);
        return sorted;    
    }

    string [] TrimAndDivide(string file)
    {
        bool log=false;
        //if(log) Interface.Log("Comvar.TrimAndDivide("+file+")"); 
        Str.TrimRight(file, ".wav");  
        
        string [] filename = Str.Tokens(file, "_");        
        
        if(log) Interface.Log("Comvar.TrimAndDivide; return "+file+" of "+filename.size()+" parts");
        return filename;
    }
    
    public string [] GetSoundParamsSC(string param, string container_name, Soup Soundscript)
    {
        bool log=false;
        if(log) Interface.Log("Comvar.GetSoundParamsSC("+param+", "+container_name+", Soundscript);");
        
        string [] result = new string[2];
        result[0]="0";
                
        string [] tokens = Str.Tokens(container_name, ";");
        
        if(tokens.size() > 1) container_name = Str.CloneString(tokens[0]);        
        string return_value;
        int i;
        for(i=0; i < Soundscript.CountTags(); i++)
        {
            if(Soundscript.GetNamedSoup(container_name).CountTags())
            {
                
                if(param == "volume") return_value = Soundscript.GetNamedSoup(container_name).GetNamedTag("volume");
                else if(param == "point") return_value = Soundscript.GetNamedSoup(container_name).GetNamedTag("attachment");
                else if(param == "mindist" or param == "maxdist")
                {
                    string distance = Soundscript.GetNamedSoup(container_name).GetNamedTag("distance");
                    string [] tokens = Str.Tokens(distance, ",");
                    if(param=="mindist") return_value = Str.CloneString(tokens[0]);
                    if(param=="maxdist") return_value = Str.CloneString(tokens[1]);
                } 
                
                if(log) Interface.Log("  return: "+return_value);
                
                result[0]="1";
                result[1]=return_value;
                return result;                                                            
            }       
        } 
        
        return result;        
    }
    
    public string [] GetTriggerSC(string container_name, Soup Soundscript)
    {
        bool log=false;
        if(log) Interface.Log("Comvar.GetTriggerSC("+container_name+", Soundscript);");
        int i;
        string [] result = new string[2];
        result[0]="0";
                
        string [] tokens = Str.Tokens(container_name, ";");
        
        if(tokens.size() > 1) container_name = Str.CloneString(tokens[0]);
        
        for(i=0; i < Soundscript.CountTags(); i++)
        {
            if(Soundscript.GetNamedSoup(container_name).CountTags())
            {
                string trigger = Soundscript.GetNamedSoup(container_name).GetNamedTag("trigger");
                if(tokens.size() > 1)
                {
                    if(log) Interface.Log("  return: "+trigger+";"+tokens[1]);
                    result[0]="1";
                    result[1]=trigger+";"+tokens[1];                    
                    return  result;             
                }
                else
                {
                    if(log) Interface.Log("  return: "+trigger+";0.0");
                    result[0]="1";
                    result[1]=trigger+";0.0";                     
                    return  result;                                        
                }
         
            }       
        }
        
        return result;
    }    
    
    public Soup AddSoundTagsVariations(string property, string subdir, string type, string whatof, Soup SoundFiles, Soup toAddSoup, string point) // tag return...true øíká, že to bylo úspìšné
    {
        bool log=false;
        if(point=="") point="x";
        if(log) Interface.Log("CM.AddSoundTagsVariations(property: "+property+", subdir: "+subdir+", type:"+type+", whatof: "+whatof+", SoundFiles, toAddSoupSoup, "+point+");");
        int found_count=0;
        string sound_tag;
        bool exact_subdir_found;
        bool searched_again;
        bool found;  
        string sound_file;
        string duration;
        string used_subdir = Str.CloneString(subdir);           
        int ls;    
        string [] filename;
        bool combined_folder;          
        
        /*
            pro joints
                successors <- 1 - 2 - 3 - x
                individualls <- 0
                entirer <- b
                merged <- x 
        */
        string variation_check;
        bool last_succesion;
        bool last_echo;
        int successors;
        int individualls;
        int entirers;
        int mergers;
        int echoers;
        
        if(property == "brakesqueal" or property == "joint")
        {
            combined_folder=true; // pokud název zaøízení neodpovídá názvu složek, budou se muset prohledat všechny zvuky, nejen danou složku
            if(log) Interface.Log("  combined folder detected due the searched property, all files will be searched...");
        }   
                           
       
        SEARCH_AGAIN:
        for(ls=0; ls < SoundFiles.CountTags(); ls++)
        {            
            if(log) Interface.Log("  processing sound data item:  "+SoundFiles.GetIndexedTagName(ls));
            string [] tag = Str.Tokens(SoundFiles.GetIndexedTagName(ls),"/");                               

            if((!combined_folder and tag[2] == property) or combined_folder) // vlastnosti
            {                                                                                        
                exact_subdir_found=false;
                searched_again=false;
                found=false;                                    
                                                    
                if(subdir == "" and type == "") // neexistuje podsložka, neexistuje typ = tag má 3 èásti (koøen / vlastnost / zvuk_èeho.wav)
                {                                                                                                              
                    filename = TrimAndDivide(Str.CloneString(tag[3]));  // 0:property / 1:whatof | brakesqueal_1_alternate  
                    if(combined_folder)
                    {
                        if(filename[0] == property and filename[2] == whatof) 
                        {                           
                            if(filename[0] == property and filename[1] == whatof)
                            {
                                if(log) Interface.Log("    searched sound data was found in multiple presence, but it is not equal!");
                                return toAddSoup; 
                            }                           
                            found=true; 
                        }
                        if(filename[0] == property and filename[1] == whatof) found=true;
                    }
                    else
                    {
                        if(filename[2] == whatof) found=true; 
                    }                                        
                }
                else if(subdir == "" and type != "") // neexistuje podsložka, existuje typ = tag má 3 èásti (koøen / vlastnost / zvuk_typ_èeho.wav)
                {
                    filename = TrimAndDivide(Str.CloneString(tag[3])); // 0:property / 1:type / 2:whatof | brakesqueal_x_1_alternate 
                    // !!! TBC !!!
                    if(combined_folder)
                    {
                        if(filename[0] == property and filename[3] == whatof) found=true; 
                    }
                    else
                    {
                        if(filename[3] == whatof) found=true; 
                    }                    
                }                
                else if(subdir != "")  // existuje podsložka (koøen / vlastnost / 2:podsložka / zvuk_?_èeho.wav)
                {
                    
                    if(used_subdir == tag[3])
                    {
                        exact_subdir_found=true;
                        
                        if(log)
                        {
                            if(!searched_again) Interface.Log("    exact subdir found!");
                            else Interface.Log("    second atempt, exact subdir found!");
                        }
                        
                        filename = TrimAndDivide(Str.CloneString(tag[4])); // 0:property / ? / 1/2:whatof                                           
                        
                        if(type == "")  // existuje podsložka a neexistuje typ (koøen / vlastnost / 2:podsložka / 3: zvuk_èeho.wav)
                        {                            
                             // !!! TBC !!!
                            if(combined_folder)
                            {
                                if(filename[0] == property and filename[2] == whatof) found=true; 
                            }
                            else
                            {
                                if(filename[2] == whatof) found=true; 
                            }        
                        }
                        else if(type == filename[1] and filename.size()==3) // existuje podsložka a existuje typ (koøen / vlastnost / 2:podsložka / 3: zvuk_typ_èeho.wav)
                        {   
                            if(log) Interface.Log("    exact type found!");                        
                             // !!! TBC !!!
                            if(combined_folder)
                            {
                                if(filename[0] == property and filename[3] == whatof) found=true; 
                            }
                            else
                            {
                                if(filename[3] == whatof) found=true; 
                            }                             
                        }                                                                                                                                           
                    }
                    else
                    {
                        if(log) Interface.Log("    exact subdir was NOT found, skipping...");
                    }                    
                }
                                 
                if(found)
                {
                    sound_file = SoundFiles.GetIndexedTagName(ls);
                    /*
                    string [] duration_tokens = Str.Tokens(SoundFiles.GetIndexedTagName(ls), "-");                   
                    if(duration_tokens.size() ==2 ) duration = Str.ToFloat(duration_tokens[0]) - Str.ToFloat(duration_tokens[1]);   
                    else duration = Str.ToFloat(duration_tokens[0]); 
                    */
                    duration = SoundFiles.GetNamedTag(sound_file);                     
                    if(!toAddSoup.GetNamedTagAsBool("return")) toAddSoup.SetNamedTag("return", true);
                    if(property == "joint")
                    {
                        if(log) Interface.Log("  joint case, checking kinship...");    
                        string [] current_tokens = Str.Tokens(filename[2], "-");
                        string current_variation = filename[2];
                        if(current_tokens.size() == 2 or current_tokens.size() == 3)
                        {
                            if(current_tokens[1] == "0") 
                            {
                                if(log) Interface.Log("    occurrence of individuallity..."); 
                                individualls++;
                                found_count++;                               
                            }
                            else if(current_tokens[0] == "b") 
                            {
                                if(log) Interface.Log("    occurrence of entirity...");
                                entirers++;
                                found_count++;                                   
                            }
                            else if(current_tokens[0] == "x")
                            {
                                if(log) Interface.Log("    occurrence of merging..."); 
                                mergers++;   
                                found_count++;          
                            }
                            else if(current_tokens[0] == "e")
                            {
                                if(variation_check == "")
                                {
                                    variation_check=filename[2];
                                    if(log) Interface.Log("    first occurrence of echoing..."); 
                                    found_count++;
                                    echoers++;
                                }
                                else
                                {                                    
                                    string [] check_tokens = Str.Tokens(variation_check, "-"); 
                                    if(log) Interface.Log("    check["+check_tokens[0]+"-"+check_tokens[1]+"] vs current["+current_tokens[0]+"-"+current_tokens[1]+"]"); 
                                    if(current_tokens[1] == check_tokens[1] and current_tokens[2] != check_tokens[2])
                                    {
                                        if(log) Interface.Log("      echoing: same varitation, same echoers");                                   
                                        last_echo=true;    
                                    }
                                    else
                                    {
                                        if(log) Interface.Log("      echoing: different varitation, incresing echoers");
                                        /*
                                        if(last_echo)
                                        {
                                            toAddSoup.SetNamedTag(property+"_"+whatof+"_"+check_tokens[0]+"_maxessor", check_tokens[1]);   
                                            last_echo=false;
                                        }
                                        else
                                        {
                                            if(ls==(SoundFiles.CountTags()-1)) toAddSoup.SetNamedTag(property+"_"+whatof+"_"+current_tokens[0]+"_maxessor", current_tokens[1]); 
                                        } 
                                        */
                                        found_count++;
                                        echoers++;
                                    }
                                    variation_check=current_variation; 
                                }       
                            }                              
                            else
                            {
                                if(variation_check == "")
                                {
                                    variation_check=filename[2];
                                    if(log) Interface.Log("    first occurrence of succession..."); 
                                    found_count++;
                                    successors++;
                                }
                                else
                                {                                    
                                    string [] check_tokens = Str.Tokens(variation_check, "-"); 
                                    if(log) Interface.Log("    check["+check_tokens[0]+"-"+check_tokens[1]+"] vs current["+current_tokens[0]+"-"+current_tokens[1]+"]"); 
                                    if(current_tokens[0] == check_tokens[0] and current_tokens[1] != check_tokens[1])
                                    {
                                        if(log) Interface.Log("      succession: same varitation, same successors");                                   
                                        last_succesion=true;    
                                    }
                                    else
                                    {
                                        if(log) Interface.Log("      succession: different varitation, incresing successors");
                                        /*
                                        if(last_succesion)
                                        {
                                            toAddSoup.SetNamedTag(property+"_"+whatof+"_"+check_tokens[0]+"_maxessor", check_tokens[1]);   
                                            last_succesion=false;
                                        }
                                        else
                                        {
                                            if(ls==(SoundFiles.CountTags()-1)) toAddSoup.SetNamedTag(property+"_"+whatof+"_"+current_tokens[0]+"_maxessor", current_tokens[1]); 
                                        } 
                                        */
                                        found_count++;
                                        successors++;
                                    }
                                    variation_check=current_variation; 
                                }                            
                            } 
                        }
                        else
                        {
                            Interface.Exception("  Wrong entry in config: "+sound_file+"..."+duration);
                            break;
                        }
                        if(log) Interface.Log("  constructed sound tag["+found_count+"] - "+property+"_"+whatof+"_"+filename[2]+": library"+";"+sound_file+";"+duration+";"+point); 
                        toAddSoup.SetNamedTag(property+"_"+whatof+"_"+filename[2], "library"+";"+sound_file+";"+duration+";"+point);                                                                                         
                    }
                    else
                    {
                        if(log) Interface.Log("  constructed sound tag "+found_count+": library"+";"+sound_file+";"+duration+";"+point); 
                        found_count++;
                        toAddSoup.SetNamedTag(whatof+"_"+found_count, "library"+";"+sound_file+";"+duration+";"+point); 
                    }
                    found=false;
                }
                else
                {             
                }             
            }                                     
        } 
        if(!searched_again and subdir != "")
        {
            if(log) Interface.Log("  exact subdir was NOT found in any entry, searching again with native "+subdir+"...");                 
            Str.Left(used_subdir,3);
            searched_again=true;
            
            goto SEARCH_AGAIN;                                     
        }
        
        if(property == "joint")
        {
            if(log) Interface.Log("  last entry of config, saving joint counts"); 
            toAddSoup.SetNamedTag("sucessors", successors);     
            toAddSoup.SetNamedTag("individualls", individualls); 
            toAddSoup.SetNamedTag("entirers", entirers); 
            toAddSoup.SetNamedTag("mergers", mergers); 
            toAddSoup.SetNamedTag("echoers", echoers); 
            toAddSoup.SetNamedTag("variations", found_count);         
        }
                      
        return toAddSoup;           
    }
     
     
    public string [] CreateSoundTag(string property, string subdir, string type, string whatof, Soup SoundFiles) // vrací za 0: true/false, 1:záznam
    {
        bool log=false;
        if(log) Interface.Log("CM.CreateSoundTag(property: "+property+", subdir: "+subdir+", type: "+type+", whatof: "+whatof+", SoundFiles);");
        string [] result = new string[2];
        result[0]="0";
        string sound_tag;
        bool exact_subdir_found=false;
        bool searched_again;
        bool found=false;  
        string sound_file;
        string duration;
        string used_subdir = Str.CloneString(subdir);           
        int ls;        
        
        bool combined_folder;   
        
        if(property == "brakecylinder")
        {
            combined_folder=true; // pokud název zaøízení neodpovídá názvu složek, budou se muset prohledat všechny zvuky, nejen danou složku
            if(log) Interface.Log("  combined folder detected due the searched property, all files will be searched...");
        }     
        
        SEARCH_AGAIN:
        for(ls=0; ls < SoundFiles.CountTags(); ls++)
        {            
            if(log) Interface.Log("  processing sound data item:  "+SoundFiles.GetIndexedTagName(ls));
            string [] tag = Str.Tokens(SoundFiles.GetIndexedTagName(ls),"/");                               
            
            if((!combined_folder and tag[2] == property) or combined_folder) // vlastnosti
            {                                                                                        
                exact_subdir_found=false;
                searched_again=false;
                found=false;                                    
                                                    
                if(subdir == "" and type == "") // neexistuje podsložka, neexistuje typ = tag má 3 èásti (koøen / vlastnost / zvuk_èeho.wav)
                {                                                                                                              
                    string [] filename = TrimAndDivide(Str.CloneString(tag[3]));  // 0:property / 1:whatof  
                    
                    if(combined_folder)
                    {
                        if(filename[0] == property and filename[1] == whatof) found=true; 
                    }
                    else
                    {
                        if(filename[1] == whatof) found=true; 
                    }                                           
                }
                else if(subdir == "" and type != "") // neexistuje podsložka, existuje typ = tag má 3 èásti (koøen / vlastnost / zvuk_typ_èeho.wav)
                {
                    string [] filename = TrimAndDivide(Str.CloneString(tag[3])); // 0:property / 1:type / 2:whatof  

                    if(combined_folder)
                    {
                        if(filename[0] == property and filename[1] == type and filename[2] == whatof) found=true; 
                    }
                    else
                    {
                        if(filename[1] == type and filename[2] == whatof) found=true; 
                    }                                                     
                }                
                else if(subdir != "")  // existuje podsložka (koøen / vlastnost / 2:podsložka / zvuk_?_èeho.wav)
                {
                    
                    if(used_subdir == tag[3])
                    {
                        exact_subdir_found=true;
                        
                        if(log)
                        {
                            if(!searched_again) Interface.Log("    exact subdir found!");
                            else Interface.Log("    second atempt, exact subdir found!");
                        }
                        
                        string [] filename = TrimAndDivide(Str.CloneString(tag[4])); // 0:property / ? / 1/2:whatof                                           
                        
                        if(type == "")  // existuje podsložka a neexistuje typ (koøen / vlastnost / 2:podsložka / 3: zvuk_èeho.wav)
                        {                            
                            if(combined_folder)
                            {
                                if(filename[0] == property and filename[1] == whatof) found=true; 
                            }
                            else
                            {
                                if(filename[1] == whatof) found=true; 
                            }            
                        }
                        else if(type == filename[1] and filename.size()==3) // existuje podsložka a existuje typ (koøen / vlastnost / 2:podsložka / 3: zvuk_typ_èeho.wav)
                        {   
                            if(log) Interface.Log("    exact type found!");                       
                            
                            if(combined_folder)
                            {
                                if(filename[0] == property and filename[1] == type and filename[2] == whatof) found=true; 
                            }
                            else
                            {
                                if(filename[1] == type and filename[2] == whatof) found=true; 
                            }  
                        }                                                                                                                                           
                    }
                    else
                    {
                        if(log) Interface.Log("    exact subdir was NOT found, skipping...");
                    }                    
                }
                                 
                if(found)
                {
                    sound_file = SoundFiles.GetIndexedTagName(ls);
                    /*
                    string [] duration_tokens = Str.Tokens(SoundFiles.GetIndexedTagName(ls), "-");                   
                    if(duration_tokens.size() ==2 ) duration = Str.ToFloat(duration_tokens[0]) - Str.ToFloat(duration_tokens[1]);   
                    else duration = Str.ToFloat(duration_tokens[0]); 
                    */
                    duration = SoundFiles.GetNamedTag(sound_file);                     
                    if(log) Interface.Log("  constructed sound tag;" +sound_file+";"+duration);    
                    sound_tag=sound_file+";"+duration; 
                    result[0]="1";
                    result[1]=sound_tag;
                    return  result;
                }             
            }                                     
        } 
        if(!searched_again and subdir != "")
        {
            if(log) Interface.Log("  exact subdir was NOT found in any entry, searching again with native "+subdir+"...");                 
            Str.Left(used_subdir,3);
            searched_again=true;
            
            goto SEARCH_AGAIN;                                     
        }
                       
        return result;                    
    }
    
    public void LogAllSoupLevels(string script_info, Soup Data)
    {
        int s;
        Interface.Log(script_info);
        for(s=0; s<Data.CountTags(); s++)
        {
            if(Data.GetNamedSoup(Data.GetIndexedTagName(s)).CountTags()==0) Interface.Log("  "+s+": "+Data.GetIndexedTagName(s)+" - "+Data.GetNamedTag(Data.GetIndexedTagName(s)));             
            else
            {
                Soup LevelOne=Data.GetNamedSoup(Data.GetIndexedTagName(s));
                int t;
                Interface.Log("  "+s+": l1 LevelOne("+Data.GetIndexedTagName(s)+")["+LevelOne.CountTags()+"]");
                Interface.Log("  -----------");
                for(t=0; t<LevelOne.CountTags(); t++)
                {
                    if(LevelOne.GetNamedSoup(LevelOne.GetIndexedTagName(t)).CountTags()==0) Interface.Log("    "+t+": "+LevelOne.GetIndexedTagName(t)+" - "+LevelOne.GetNamedTag(LevelOne.GetIndexedTagName(t))); 
                    else
                    {
                        Soup LevelTwo=LevelOne.GetNamedSoup(LevelOne.GetIndexedTagName(t));
                        int v;
                        Interface.Log("    "+t+": l2 LevelOne("+LevelOne.GetIndexedTagName(t)+"["+LevelTwo.CountTags()+"])");
                        Interface.Log("    -----------");                        
                        for(v=0; v < LevelTwo.CountTags(); v++)
                        {
                            if(LevelTwo.GetNamedSoup(LevelTwo.GetIndexedTagName(v)).CountTags()==0) Interface.Log("    "+v+": "+LevelTwo.GetIndexedTagName(v)+" - "+LevelTwo.GetNamedTag(LevelTwo.GetIndexedTagName(v))); 
                            else
                            {
                                Soup LevelThree=LevelTwo.GetNamedSoup(LevelTwo.GetIndexedTagName(v));
                                int x;
                                Interface.Log("      "+v+": l3 soup("+LevelTwo.GetIndexedTagName(v)+"["+LevelThree.CountTags()+"])");
                                Interface.Log("      -----------");                                      
                                for(x=0; x < LevelThree.CountTags(); x++)
                                {                                
                                    if(LevelThree.GetNamedSoup(LevelThree.GetIndexedTagName(x)).CountTags()==0) Interface.Log("        "+x+": "+LevelThree.GetIndexedTagName(x)+" - "+LevelThree.GetNamedTag(LevelThree.GetIndexedTagName(x)));
                                    else
                                    {
                                        Soup LevelFour=LevelThree.GetNamedSoup(LevelThree.GetIndexedTagName(x));
                                        int y;
                                        Interface.Log("        "+x+": l4 soup("+LevelThree.GetIndexedTagName(x)+"["+LevelFour.CountTags()+"])");
                                        Interface.Log("        -----------");                                      
                                        for(y=0; y < LevelFour.CountTags(); y++)
                                        {                                
                                            Interface.Log("        "+y+": "+LevelFour.GetIndexedTagName(y)+" - "+LevelFour.GetNamedTag(LevelFour.GetIndexedTagName(y)));                                   
                                        }
                                        Interface.Log("        -----------");                                     
                                    }                                     
                                }
                                Interface.Log("      -----------");   
                            }                             
                        }
                        Interface.Log("    -----------");                          
                    }
                }
                Interface.Log("  -----------");
            }
        }         
    }


    public void DeprecateAllEffects(Vehicle Veh)
    {
        Soup meshTable = Veh.GetAsset().GetConfigSoup().GetNamedSoup("mesh-table"); 
        
        int c;
        for(c=0; c < meshTable.CountTags(); c++)
        {
            Soup mesh = meshTable.GetNamedSoup(meshTable.GetIndexedTagName(c));
            if(mesh.GetNamedSoup("effects").CountTags())
            {
                Soup effects = mesh.GetNamedSoup("effects");
                int t;
                for(t=0; t < effects.CountTags(); t++)
                {
                    Interface.Log(effects.GetIndexedTagName(t));
                    Veh.SetFXCoronaTexture(effects.GetIndexedTagName(t),null);     
                }
            }
        }   
    }

  // délka vektoru mezi sledovaným objektem kamerou a poskytnutým objektem
  // pokud kamera je v roomingu, nelze získat její pozici, nebo získané hodnoty funkcí GetCameraPosition dávají nelogické výsledky vzhledem k umístìní ve svìtì (tvùce mapy po musel umístit zaèátek svìta po každém ukonèení tvorby)
  // distance slouží jako limita (vìtšinou pro vykreslení objektu)
    public bool TargetDistanceObject(MapObject op_Objekt, float distance, string mesh) 
    {        
        bool state;
        if(mesh == "")
        {
            //  koordináty
            //  **********            
            WorldCoordinate Souradnice; 
            //souøadnice objektu
            float o_x; 
            float o_y;
            float o_z;
            //souøadnice kamery
            float c_x;
            float c_y;
            float c_z;
            //vektory
            float u;
            float v;
            float w;
            float velikost_vektoru; 
  
            if(op_Objekt == null) return false;
            Souradnice = op_Objekt.GetMapObjectPosition();
            o_x = Souradnice.x;				
            o_y = Souradnice.y;
            o_z = Souradnice.z;
            
            MapObject TargetObject = World.GetCameraTarget();
            
            if(TargetObject == null)
            {
                state=true; // kamera nesleduje žádný objekt, není možné zjistit, kde se uživatel nachází, budeme pøeopokládat, že blízko
            }
            else
            {
              Souradnice = TargetObject.GetMapObjectPosition();
              c_x = Souradnice.x;
              c_y = Souradnice.y;
              c_z = Souradnice.z;
              
              u=(c_x-o_x);
              v=(c_y-o_y);
              w=(c_z-o_z);     
              velikost_vektoru = Math.Sqrt((u*u)+(v*v)+(w*w)); 
              
              
              if(distance < velikost_vektoru) state=false;
              else state= true;  
            }      
        }    
        
        return state;
    }  
    
    public Soup Doba_Zvuku(float cislo)
    {
        Soup Dvojcisli = Constructors.NewSoup();
        int cele;
        float zbytek;
        if(cislo > 10.0)
        {
            if(cislo%10 == 0)
            {
                cele = cislo;
                zbytek=0.0;   
            }
            else
            {               
                float desetina=0;
                cele = cislo; // = 75
                int zaklad = cele - (cele%10); // = 70
                zbytek = 10 - ((zaklad+10) - cislo);  // = 10 - (4,3) = 5,699997
                zaklad = cele%10;
                desetina = 1.0-((zaklad+1)-zbytek); // 1.0 - (6-5,69997) = 0,699997 
                zbytek = zaklad%2 + desetina; // 1,699997
            }
        }
        else
        {
            if(cislo%1 == 0)
            {
                cele = cislo;
                zbytek=0.0;   
            }
            else
            {
                float desetina=0;
                cele = cislo; // = 4
                zbytek = (cele+1) - cislo;  // = 5 - (4,95) = 0,05
                desetina = 1.0-zbytek; // 1.0 - 0,05 = 0,95
                zbytek = desetina; // 0,95
            }           
        }
        if(cele%2 != 0) 
        {
            cele = cele-1;
            zbytek = zbytek + 1.0;
        }
    
        Dvojcisli.SetNamedTag("cela_cast",cele);
        Dvojcisli.SetNamedTag("zbytek",zbytek); 
        
        return Dvojcisli;     
    }
    
    
    // zdá se, že Trainz neumí zaokrouhlovat ze Float do Int (14.789 -> 14)
    public int RoundFloatToInt(float fl_num)
    {
        // napø. 54.548
        int number;
        float remnant;
        
        int i;
        for(i=0;i < 10000; i++)
        {
            remnant = fl_num-i; // 54.548 - 54 = 0.548
            if(remnant < 1.0)
            {
                if(remnant >= 0.5) number=i+1; // 54 + 1
                else number=i; 
                break;  
            }
        }
    
        Interface.Log("CM.RoundFloatToInt; "+number);
        return number;
    }
    
};
