(async () => {
  
  const defaultPuissante = false; 

  // Create the HTML content for the dialog
  const content = `
      <form>
          <div class="form-group">
              <label for="damageAmount">Raw damage :</label>
              <input type="number" id="damageAmount" name="damageAmount" value="0" min="0" step="1" style="width: 100%;"/>
          </div>
          <div class="form-group">
              <label for="isPuissante">Powerful attack ?</label>
              <input type="checkbox" id="isPuissante" name="isPuissante"/>
          </div>
          <div class="form-group">
            <label for="isMagic">Magic attack ?</label>
            <input type="checkbox" id="isMagic" name="isMagic"/>
          </div>
          <div class="form-group">
            <label for="isHead">Aimed at the head ?</label>
            <input type="checkbox" id="isHead" name="isHead"/>
          </div>
      </form>
  `;

  // Create the Dialog instance
  const dialog = new Dialog({
      title: "Damage computing the Witcher - ethan_daubr",
      content: content,
      buttons: {
          confirm: {
              icon: '<i class="fas fa-check"></i>',
              label: "Confirm",
              callback: async (html) => {
                  const damage = parseInt(html.find('#damageAmount').val());
                  const isPuissante = html.find('#isPuissante').is(':checked'); // .is(':checked') returns true/false
                  const isMagic = html.find('#isMagic').is(':checked'); // .is(':checked') returns true/false
                  const isHead = html.find('#isHead').is(':checked'); // .is(':checked') returns true/false

                  //console.log("Damage computing the Witcher debug...");

                  // Assign the captured values to variables
                  const degats = isNaN(damage) ? 0 : damage;
                  const estPuissante = isPuissante;
                  const estMagique = isMagic; 
                  const Headshot = isHead;

                  // Chat
                  let chatMessageContent = "<h2>The Witcher damage</h2><ul>";

                  // Recupere la liste des tokens selectionnes
                  const selectedTokens = canvas.tokens.controlled;

                  // Verifie s'il y a des tokens selectionnes
                  if (selectedTokens.length === 0) {
                      ui.notifications.warn("No token selected. Please select the attacker and THEN the defender.");
                      return; // Arrete l'execution de la macro
                  }


                  // Computing

                  if (canvas.tokens.controlled.length === 2) {
                  
                    chatMessageContent += "<h3>Stats :</h3>"; // <ul>
                    chatMessageContent += `<br> Raw damage = ${degats} `;
                    
                    // Perso
                    let selectedToken = canvas.tokens.controlled[0];
                    let actorName = selectedToken.actor.name; // Get the actor's name for the message
                    chatMessageContent += `<br> Attacker : ${actorName} `;
                    
                    let Defender = canvas.tokens.controlled[1];
                    let defenderName = Defender.actor.name; // Get the actor's name for the message
                    chatMessageContent += ` |  Defender : ${defenderName} `;


                    // paths
                    const hpValuePath = "system.derivedStats.hp.value";
                    const ArmorValuePath = "system.derivedStats.shield.value";
                    const DodgeRefPath = "system.skills.ref.dodge.value";
                    const MeleeRefPath = "system.skills.ref.melee.value";
                    const RefStatPath = "system.stats.ref.current";
                    const ItemArmor = "itemTypes.armor"; //list with the items, then in WitcherItem, system.headStopping/rightArmStopping/torsoStopping

                    /*
                    Method to find paths :
                        - Press F12, go to console
                        - Select a token and enter canvas.tokens.controlled[0].actor in the console
                        - go in system
                        - then find what you want
                    */

                    
                    // Armor
                    let armor_list = Defender.actor.itemTypes.armor;
                    let armorValue = 0;
                    //console.log(armor_list);
                    const roll_armor = await new Roll("1d20").roll({async: true});
                    console.log("Dice", roll_armor.total, roll_armor.total % 2 == 0);
                    // It will take the first piece of armor it finds (and the good one : a helmet for the head...)
                    for (const armor_piece of armor_list) {

                        if (Headshot) {
                            try {
                                const buffer = armor_piece.system.headStopping;       
                                // Only modifying if != 0
                                if (buffer > 0) {
                                    armorValue = buffer;   
                                    // Reducing stats
                                    for (let c = 0; c < 4; c++) {
                                        
                                    try {
                                    if (Defender.actor.itemTypes.armor[c].system.headStopping != 0) {
                                        const upbuffer = {};
                                        upbuffer["headStopping"] = Defender.actor.itemTypes.armor[c].system.headStopping - 1;
                                        Defender.actor.itemTypes.armor[c].system.update(upbuffer);
                                        console.log("head",c);
                                    }

                                    
                                    } catch(e) {}
                                    }
                                    break;
                                }
                            } catch (e) {
                                console.error(e);
                            }   
                        } else {
                            
                            try {
                                
                                
                                if (roll_armor.total % 2 == 0) {
                                    
                                   const buffer = armor_piece.system.torsoStopping;      
                                    // Only modifying if != 0
                                    if (buffer > 0) {
                                        armorValue = buffer;    
                                        // Reducing stats
                                        for (let c = 0; c < 4; c++) {
                                        try {
                                    
                                            if (Defender.actor.itemTypes.armor[c].system.torsoStopping != 0) {
                                                const upbuffer = {};
                                                upbuffer["torsoStopping"] = Defender.actor.itemTypes.armor[c].system.torsoStopping - 1;
                                                Defender.actor.itemTypes.armor[c].system.update(upbuffer);
                                                console.log("torso",c);
                                            } 
            
                                        
                                        } catch(e) {}
                                        }
                                        break; 
                                    }
                                } else {
                                    const buffer = armor_piece.system.leftLegStopping;       
                                    // Only modifying if != 0
                                    if (buffer > 0) {
                                        armorValue = buffer;    
                                        // Reducing stats
                                        for (let c = 0; c < 4; c++) {
                                        try {
                                            if (Defender.actor.itemTypes.armor[c].system.leftLegStopping != 0) {
                                                const upbuffer = {};
                                                upbuffer["leftLegStopping"] = Defender.actor.itemTypes.armor[c].system.leftLegStopping - 1;
                                                Defender.actor.itemTypes.armor[c].system.update(upbuffer);
                                                
                                                console.log("legleft",c);
                                            }
                                            if (Defender.actor.itemTypes.armor[c].system.rightLegStopping != 0) {
                                                const upbuffer = {};
                                                upbuffer["rightLegStopping"] = Defender.actor.itemTypes.armor[c].system.rightLegStopping - 1;
                                                Defender.actor.itemTypes.armor[c].system.update(upbuffer);
                                                
                                                console.log("legright",c);
                                            }
                                        
                                        } catch(e) {}
                                        }
                                        break; 
                                    }
                                }

                            }  catch (e) {
                                console.error(e);
                            }   
                        } 
                    }
                    console.log(armorValue);
                    if (armorValue < 0) {
                        chatMessageContent += `<br>debugarmor<0`;
                        armorValue = 0;
                    }
                    //let armorValue = Defender.actor.system.derivedStats.shield.value ?? 0;
                    let currentHp = Defender.actor.system.derivedStats.hp.value;
                    let Dodge = Defender.actor.system.skills.ref.dodge.value;
                    let Melee = Defender.actor.system.skills.ref.melee.value;
                    let Ref = Defender.actor.system.stats.ref.current;
                    let mod_c_raw = selectedToken.actor.system.stats.body.current;
                    let will_def = Defender.actor.system.stats.will.current;
                    let magic_resist = Defender.actor.system.skills.will.resistmagic.value;

                    
                    chatMessageContent += `<br>`;
                    chatMessageContent += `<br> Stats of the defender : `;
                    chatMessageContent += `<br>🛡️ Armor : ${armorValue} `;
                    chatMessageContent += `<br>🫀 HP : ${currentHp} `;
                    
                    chatMessageContent += `<br> Dodge stat : ${Dodge} `;
                    chatMessageContent += `<br> Parry stat : ${Melee} `;
                    //chatMessageContent += `<br> Ref stat : ${Ref} `;        // comment if you want it not to appear to everyone
                    
                    
                    // We dodge or na ?
                    let bool_dodge = 0;
                    if (estMagique) {       // Magic forces magic resist
                        chatMessageContent += `<br>Magic resist... `;
                    } else if (Melee > Dodge ) {
                        chatMessageContent += `<br>Parrying is the better option. `;
                    } else {
                        chatMessageContent += `<br>Dodging is the better option. `;
                        bool_dodge = 1;
                    }

                    // DEF TOTAL
                    chatMessageContent += `<br>`;
                    chatMessageContent += "<br><h3>Computing :</h3>";
                    const roll = await new Roll("1d10").roll({async: true});
                    chatMessageContent += `<br> D10 : ${roll.total} `;
                    
                    let total_def = 0;

                    total_def += roll.total;
                    if (estMagique) {
                        total_def += will_def;
                        total_def += magic_resist;
                        chatMessageContent += `<br> Total defense : ${magic_resist} + ${will_def} + ${roll.total} = ${total_def} `;
                    } else {
                    total_def += Ref;
                    if (bool_dodge === 0) {
                        total_def += Melee;
                        chatMessageContent += `<br> Total defense : ${Melee} + ${Ref} + ${roll.total} = ${total_def} `;
                    } else {
                        total_def += Dodge;
                        chatMessageContent += `<br> Total defense : ${Dodge} + ${Ref} + ${roll.total} = ${total_def} `;
                    }
                    }

                    //console.log("Crit...");

                    // Compute crit
                    let overstat;
                    overstat = degats - total_def;
                    if (Headshot) {
                        overstat -= 6;
                    }

                    let crit = 0;
                    let failed = 0;
                    if (overstat <=0) {
                        chatMessageContent += `<br> <b>FAILURE.</b>`;
                        failed = 1;
                    } else if (overstat <= 7){
                        chatMessageContent += `<br> <b>HIT</b> !`;
                    } else if (overstat <= 10) {
                        chatMessageContent += `<br> <b>HIT</b> and <b>simple crit(1)</b>`;
                        crit = 3; 
                    } else if (overstat <= 13) {
                        chatMessageContent += `<br> <b>HIT</b> and <b>complex crit(2)</b>`;
                        crit = 5;
                    } else if (overstat <= 15) {
                        chatMessageContent += `<br> <b>HIT</b> and <b>difficult crit(3)</b>`;
                        crit = 8;
                    } else {
                        chatMessageContent += `<br> <b>HIT</b> and <b>DEADLY crit(4)</b>`;
                        crit = 10;
                    }

                    if (failed === 0) {
                    // damage
                    chatMessageContent +="<br>";
                    chatMessageContent += "<br><h3>Final damage :</h3>";

                    let f_dam;
                    let mod_c;
                    
                    if (estMagique) {
                        mod_c = 0;
                    } else {
                    if (mod_c_raw <= 2) {
                        mod_c = -4;
                    } else if (mod_c_raw <= 4) {
                        mod_c = -2;
                    } else if (mod_c_raw <= 6) {
                        mod_c = 0;
                    } else if (mod_c_raw <= 8) {
                        mod_c = 2;
                    } else if (mod_c_raw <= 10) {
                        mod_c = 4;
                    } else if (mod_c_raw <= 12) {
                        mod_c = 6;
                    } else {
                        mod_c = 8;
                    }
                    }

                    if (Headshot) {
                        f_dam = (degats + mod_c - armorValue)*3 + crit
                    } else {
                        f_dam = (degats + mod_c - armorValue)*1 + crit
                    }

                    chatMessageContent += `<br>🫀 Powerful hit, multiply by 2 damage : ${f_dam} * 2 `;
                    // Powerful, multiply by 2
                    if (estPuissante){
                        f_dam*=2;
                    }
                    chatMessageContent += `<br>🫀 Final damage : ${f_dam} `;
                    
                    console.log("Updating HP...");
                    // Update HP
                    const updateData = {};
                    updateData[hpValuePath] = currentHp - f_dam;
                    if (currentHp - f_dam >= 0) {
                    try {
                    Defender.actor.update(updateData);
                    } catch (e) {
                    ui.notifications.error(`Erreur lors de la mise à jour des PV pour ${defenderName}.`);
                    console.error("Erreur de mise à jour de l'acteur:", e);
                    }
                    } else {
                        chatMessageContent += `<br>🫀 <b>TARGET DEAD...</b>`;
                        try {
                            updateData[hpValuePath] = 0
                            Defender.actor.update(updateData);
                        } catch (e) {
                        ui.notifications.error(`Erreur lors de la mise à jour des PV pour ${defenderName}.`);
                        console.error("Erreur de mise à jour de l'acteur:", e);
                        }
                    }
                    chatMessageContent +="<br>";

                    if (armorValue >= 1) {
                        // Update armor called shield in the editor if you use that one
                        const updateData1 = {};
                        updateData1[ArmorValuePath] = armorValue-1;
                        try {
                        Defender.actor.update(updateData1);
                        } catch (e) {
                        ui.notifications.error(`Erreur lors de la mise à jour de l'armure pour ${defenderName}.`);
                        console.error("Erreur de mise à jour de l'acteur:", e);
                        }
                    }
                    chatMessageContent += "HP and Armor up to date !";
                    chatMessageContent +="<br>"
                    chatMessageContent += "<br><h3>Don't forget crits !</h3>";
                    }
                    ChatMessage.create({
                      speaker: ChatMessage.getSpeaker({actor: selectedTokens.actor}),
                      content: chatMessageContent
                    });
                    //ui.notifications.info(`Degâts: ${degats}, Puissante: ${estPuissante}`);

                  } else {
                    ui.notifications.warn("Please select exactly two token.");
                  }             
            }
          },
          cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: "Abort",
              callback: () => null // Return null if cancelled
          }
      },
      default: "confirm",
      close: () => {
          // This is useful for debugging if the dialog closes unexpectedly
          console.log("Dialog closed.");
      }
  }).render(true);
})();
