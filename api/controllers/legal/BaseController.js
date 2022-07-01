/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getActions: function(user,module_name){


        let actions = '';
    
    
    
        if(!user) {
            return actions;
        }
    
      
        let href = 'javascript:;';
        let onclick = "deleteRow('" + user.id + "')";
        //confirm_string.concat("return confirm('Are You Sure')");
        
            actions = '<a href='+ module_name+'_update/'+user.id +' class="mr5"><span class="glyphicons glyphicons-edit"></span></a>'; 
            actions += "<a href="+ module_name+ "_view/"+user.id+ " class='mr5'><span class='glyphicons glyphicons-eye_open'></span></a>"; 
            actions += '<a href='+ href  + ' onclick='+ onclick + '><span class="glyphicons glyphicons-bin"></span></a>';
        
        
    
        return actions;
    },
    
    
    

};

