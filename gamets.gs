include "commonscripts.gs"

static class GM
{
    bool b_log=true;

    public int PositionInConsist(Vehicle Veh)
    {
        int position;
        int i;
        Vehicle [] VehicleInConsist = Veh.GetMyTrain().GetVehicles();
        for(i=0; i<VehicleInConsist.size(); i++)
        {
            if(VehicleInConsist[i] == Veh)
            {
                position=(i+1);
                break;
            }
        }
        if(b_log) Interface.Log("GM.PositionInConsist("+Veh.GetLocalisedName()+"); is "+position+". vehicle in consist!");
        return position;     
    }
    
    public int ArrayPositionInConsist(Vehicle Veh)
    {
        int position;
        int i;
        Vehicle [] VehicleInConsist = Veh.GetMyTrain().GetVehicles();
        for(i=0; i<VehicleInConsist.size(); i++)
        {
            if(VehicleInConsist[i] == Veh)
            {
                position=i;
                break;
            }
        }
        if(b_log) Interface.Log("GM.ArrayPositionInConsist("+Veh.GetLocalisedName()+"); is "+position+". vehicle in consist!");
        return position;     
    }    

    public bool PantSelection(Vehicle Veh)
    {        
        bool should_raise_front_pant;
        Vehicle[] VehicleInConsist = Veh.GetMyTrain().GetVehicles();
        
        int vehicle_count = VehicleInConsist.size();
        
        if(vehicle_count == 1)
        {
            should_raise_front_pant = false;
        }
        else if(vehicle_count==2 and ((VehicleInConsist[VehicleInConsist.size()-1] == Veh) or (VehicleInConsist[0] == Veh)))
        {
            if(VehicleInConsist[0] == Veh) 
            {
                if(VehicleInConsist[1].GetEngineType()==0) should_raise_front_pant = 0; // jsem na zaèátku, za mnou není HV a zvedám pant dle Trainz pantcyklu
                else should_raise_front_pant = true; // jsem na zaèátku, za mnou je HV a zvedám pøední pant   
            }
            else should_raise_front_pant = false;  // jsem na konci a bez ohledu an to, zde je pøede mnou HV, zvedám pant dle Trainz cyklu  
        }
        else if(vehicle_count>2)
        {
            if(VehicleInConsist[0] == Veh)
            {
                if(VehicleInConsist[1].GetEngineType()==0) should_raise_front_pant = false;
                if(VehicleInConsist[1].GetEngineType()!=0) should_raise_front_pant = true;    
            }
            else if(VehicleInConsist[VehicleInConsist.size()-1] == Veh)
            {
                should_raise_front_pant = false;    
            }
            else
            {
                int i;
                for (i=0; i<VehicleInConsist.size(); i++)
                {
                    if(VehicleInConsist[i] == Veh and i != vehicle_count)
                    {
                        if(VehicleInConsist[i+1].GetEngineType()==0 and VehicleInConsist[i-1].GetEngineType()==0) should_raise_front_pant = 0; // jsem uprostøed, za mnou a pøede mnou není HV a zvedám pant dle Trainz pantcyklu
                        if(VehicleInConsist[i+1].GetEngineType()!=0 and VehicleInConsist[i-1].GetEngineType()==0) should_raise_front_pant = 1; // jsem uprostøed, za mnou je HV a zvedám pøední pant
                        if(VehicleInConsist[i+1].GetEngineType()==0 and VehicleInConsist[i-1].GetEngineType()!=0) should_raise_front_pant = 0; // jsem uprostøed, pøede mnnou je HV a zvedám pant dle Trainz pantcyklu
                        if(VehicleInConsist[i+1].GetEngineType()!=0 and VehicleInConsist[i-1].GetEngineType()!=0) should_raise_front_pant = 0; // jsem uprostøed, pøede mnnou i za mnou je HV a zvedám pant dle Trainz pantcyklu
                        break;
                    }     
                }             
            }                   
        }
        if(b_log) Interface.Log("GM.PantSelection("+Veh.GetLocalisedName()+"); should raise front pant: "+should_raise_front_pant+"!");          
        return should_raise_front_pant;
    }

    public bool IsTrainLoco(Train Consist, Vehicle Veh)
    {               
        bool value;
        if(Veh == Consist.GetFrontmostLocomotive()) value=true;
        else value=false;
        
        if(b_log) Interface.Log("GM.IsTrainLoco("+Veh.GetLocalisedName()+"); return: "+value+"!");             
        return value;   
    }
    
    
    public Soup ObtainFirstCommand(DriverCharacter TrainDriver)
    {
        Soup Final = Constructors.NewSoup();
        DriverCommands Commands; // jedná se o objekt nadøazený všem jiným skritpovým drivercommand, i když to zní nesmyslnì
        DriverScheduleCommand [] commandList; // objektové pole, ve kterém jsou DriverCommand (bez s!)
        DriverCommand Command;  // jeden urèitý objekt typu pøíkaz, který vlastnì obsahuje ty naøízení pro strojvedoucího
        Soup commandData = Constructors.NewSoup();
        Commands = TrainDriver.GetDriverCommands(); //DriverCommands, získej od strojvedoucího momentální pøíkazy
        commandList = Commands.GetDriverScheduleCommands(); //DriveScheduleCommand pole, vytvoø ze získané fronty seznam pøíkazù
        if(b_log) Interface.Log("GM.ObtainCommand("+TrainDriver.GetLocalisedName()+");");
        
        if (commandList.size() > 0)
        {            
            Command = commandList[0].GetDriverCommand();
            if(b_log) Interface.Log("  Command list is not empty");
            Soup commandParams = commandList[0].GetProperties(); // zajímá tì pouze první pøíkaz, jeho databáze            
            Asset commandAsset = Command.GetAsset(); // z reference vytvoøím aktivum

            if(commandParams != null)
            {
                if(b_log) Interface.Log("  Command parameters are not empty");
                int t;
                commandData.SetNamedTag("LocalisedNamed", commandAsset.GetLocalisedName());
                commandData.SetNamedTag("Kuid", commandAsset.GetKUID());
                for(t=0; t<commandParams.CountTags(); t++)
                {
                    if(b_log) Interface.Log("    "+commandParams.GetIndexedTagName(t)+" - "+commandParams.GetNamedTag(commandParams.GetIndexedTagName(t)));
                    commandData.SetNamedTag(commandParams.GetIndexedTagName(t),commandParams.GetNamedTag(commandParams.GetIndexedTagName(t)));    
                }
            }                                                    
        }
        else commandData=null;

        Final = commandData;
                
        return Final;            
    }      
    
    
    public Train ChangeTrain(Vehicle Veh, Train formerTrain)
    {
        if(formerTrain != null) Veh.Sniff(formerTrain, "Train", "", false);
        Train newTrain = Veh.GetMyTrain();
        Veh.Sniff(newTrain, "Train", "", true);  
             
        if(b_log) 
        {
            if(formerTrain != null) Interface.Log("GM.ChangeTrain("+Veh.GetLocalisedName()+", "+formerTrain.GetName()+"); return "+newTrain.GetName());
            else Interface.Log("GM.ChangeTrain("+Veh.GetLocalisedName()+", train is non-existent); return "+newTrain.GetName());
        }    
        
        return newTrain;
    } 
    
    
    public DriverCharacter ChangeTrainDriver(Vehicle Veh, DriverCharacter formerDriver)
    {
        DriverCharacter newDriver;
        if(Veh != null)
        {
            if(formerDriver != null) Veh.Sniff(formerDriver, "DriverCharacter", "", false);
            DriverCharacter newDriver = Veh.GetMyTrain().GetActiveDriver();
            if(newDriver != null)  Veh.Sniff(newDriver, "DriverCharacter", "", true);

            if(b_log) 
            {
                if(formerDriver != null and newDriver != null) Interface.Log("GM.ChangeTrainDriver("+Veh.GetLocalisedName()+", "+formerDriver.GetLocalisedName()+"); return "+newDriver.GetLocalisedName());
                else if(formerDriver == null and newDriver != null) Interface.Log("GM.ChangeTrainDriver("+Veh.GetLocalisedName()+", driver is non-existent); return "+newDriver.GetLocalisedName());
                else if(formerDriver == null and newDriver == null) Interface.Log("GM.ChangeTrainDriver("+Veh.GetLocalisedName()+", driver is non-existent); return null");              
            }        
        
        }
                
        /*
        DriverCharacter[] vsichniStrojvedouci = World.GetDriverCharacterList();
        DriverCharacter Strojvedouci=null;
        int r=0;
        for(r; r < vsichniStrojvedouci.size();r++) // reset Sniff
        {
            op_Vozidlo.Sniff(vsichniStrojvedouci[r],"DriverCharacter", "",false);                
        }                
        int s=0;
        for(s=0; s < vsichniStrojvedouci.size();s++) // reaktivace Sniff
        {
            if(op_Vozidlo == vsichniStrojvedouci[s].GetLocation())
            {
                Strojvedouci = vsichniStrojvedouci[s];
                op_Vozidlo.Sniff(Strojvedouci,"DriverCharacter", "",true);
            }
            else
            {
                op_Vozidlo.Sniff(vsichniStrojvedouci[s],"DriverCharacter", "",true);
            }
                
        }
        */
  
        return newDriver;
    }

}; 
