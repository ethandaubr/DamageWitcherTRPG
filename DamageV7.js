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
        
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <label for="checkboxSword" style="margin-right: 5px;">Sword </label>
                    <input type="checkbox" id="checkboxSword" name="checkboxSword"/>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="checkboxSmallBlade" style="margin-right: 5px;">SmallBlade </label>
                    <input type="checkbox" id="checkboxSmallBlade" name="checkboxSmallBlade"/>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="checkboxStaff" style="margin-right: 5px;">Staff/Spear </label>
                    <input type="checkbox" id="checkboxStaff" name="checkboxStaff"/>
                </div>
          </div>

          <div class="form-group">
              <label for="bonusAmount">Attack Bonus : </label>
              <input type="number" id="bonusAmount" name="bonusAmount" value="0" min="0" step="1" style="width: 100%;"/>
          </div>

          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <label for="checkboxB" style="margin-right: 5px;">Option B :</label>
                    <input type="checkbox" id="checkboxB" name="checkboxB"/>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="checkboxP" style="margin-right: 5px;">Option P :</label>
                    <input type="checkbox" id="checkboxP" name="checkboxP"/>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="checkboxS" style="margin-right: 5px;">Option S :</label>
                    <input type="checkbox" id="checkboxS" name="checkboxS"/>
                </div>
            </div>

            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <label for="piercingCheckbox" style="margin-right: 5px;">Piercing :</label>
                    <input type="checkbox" id="piercingCheckbox" name="piercingCheckbox"/>
                </div>
                <div style="display: flex; align-items: center;">
                    <label for="piercingPlusCheckbox" style="margin-right: 5px;">Piercing + :</label>
                    <input type="checkbox" id="piercingPlusCheckbox" name="piercingPlusCheckbox"/>
                </div>
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
                  const Att_bonus = parseInt(html.find('#bonusAmount').val());
                  const isPuissante = html.find('#isPuissante').is(':checked'); // .is(':checked') returns true/false
                  const isMagic = html.find('#isMagic').is(':checked'); // .is(':checked') returns true/false
                  const isHead = html.find('#isHead').is(':checked'); // .is(':checked') returns true/false
                  let attack_typeB0P1S2 = 9;
                  if (html.find('#checkboxB').is(':checked')) {
                    attack_typeB0P1S2 = 0;
                  }
                  if (html.find('#checkboxP').is(':checked')) {
                    attack_typeB0P1S2 = 1;
                  }
                  if (html.find('#checkboxS').is(':checked')) {
                    attack_typeB0P1S2 = 2;
                  }
                  
                  const perforation = html.find('#piercingCheckbox').is(':checked');
                  const perforation_plus = html.find('#piercingPlusCheckbox').is(':checked');

                  /*
                  AttackTool
                  0 -> Brawl
                  1 -> Sword
                  2 -> SmallBlade
                  3 - Staff/spear
                  */
                  let AttackTool = 0;
                  if (html.find('#checkboxSword').is(':checked')) {
                    AttackTool = 1;
                  }
                  if (html.find('#checkboxSmallBlade').is(':checked')) {
                    AttackTool = 2;
                  }
                  if (html.find('#checkboxStaff').is(':checked')) {
                    AttackTool = 3;
                  }
                  

                  //console.log("Damage computing the Witcher debug...");

                  // Assign the captured values to variables
                  let degats = isNaN(damage) ? 0 : damage;
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

                    // PNJ Armor
                    const armorHeadValue = Defender.actor.system?.armorHead;
                    const armorUpperValue = Defender.actor.system?.armorUpper;
                    const armorLowerValue = Defender.actor.system?.armorLower;

                    // Bool to know if it is an actual player
                    let DefenderIsPJ = true;
                    if (armorHeadValue !== undefined) {
                        DefenderIsPJ = false;
                    }

                    // Choose upper or lower
                    const roll_armor = await new Roll("1d20").roll({async: true});
                    console.log("Dice", roll_armor.total, roll_armor.total % 2 == 0);
                    const UpperOrLower = (roll_armor.total % 2 == 0);

                    // Var
                    let armorValue = 0;

                    if (DefenderIsPJ) {
                        //console.log("PJ");
                        armorValue = PJArmor(Headshot,UpperOrLower);
                    } else {
                        //console.log("PNJ");
                        armorValue = await PNJArmor(Headshot,UpperOrLower);
                    }
                   
                    console.log(armorValue);
                    //let armorValue = Defender.actor.system.derivedStats.shield.value ?? 0;
                    let currentHp = Defender.actor.system.derivedStats.hp.value;
                    let Dodge = Defender.actor.system.skills.ref.dodge.value;
                    let Melee = Defender.actor.system.skills.ref.melee.value;
                    let Ref = Defender.actor.system.stats.ref.current;
                    let Att_Ref = selectedToken.actor.system.stats.ref.current;
                    let mod_c_raw = selectedToken.actor.system.stats.body.current;
                    let will_def = Defender.actor.system.stats.will.current;
                    let magic_resist = Defender.actor.system.skills.will.resistmagic.value;
                    let Att_brawling = selectedToken.actor.system.skills.ref.brawling.value;
                    let Att_swordsmanship = selectedToken.actor.system.skills.ref.swordsmanship.value;
                    let Att_smallblades = selectedToken.actor.system.skills.ref.smallblades.value;
                    let Att_staffspear = selectedToken.actor.system.skills.ref.staffspear.value;

                    
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
                    const roll2 = await new Roll("1d10").roll({async: true});

                    // Defender
                    chatMessageContent += `<br> <b>Defender : </b>`;
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

                    // Attack roll
                    let attack_roll = 0;
                    chatMessageContent += `<br>`;
                    chatMessageContent += `<br> <b>Attacker : </b>`;
                    chatMessageContent += `<br> D10 : ${roll2.total} `;
                    attack_roll += roll2.total;
                    attack_roll += Att_Ref;
                    // Att_Ref + (?) -> Att_swordsmanship,brawling,smallblades
                    /*
                    AttackTool
                    0 -> Brawl
                    1 -> Sword
                    2 -> SmallBlade
                    3 - Staff/spear
                    */
                   if (AttackTool == 0) {
                        attack_roll += Att_brawling;
                        chatMessageContent += `<br> Total attack : ${roll2.total} + ${Att_Ref} + ${Att_brawling} = ${attack_roll} `;
                   } else if (AttackTool == 1) {
                        attack_roll += Att_swordsmanship;
                        chatMessageContent += `<br> Total attack : ${roll2.total} + ${Att_Ref} + ${Att_swordsmanship} = ${attack_roll} `;
                   } else if (AttackTool == 2) {
                        attack_roll += Att_smallblades;
                        chatMessageContent += `<br> Total attack : ${roll2.total} + ${Att_Ref} + ${Att_smallblades} = ${attack_roll} `;
                   } else if (AttackTool == 3) {
                        attack_roll += Att_staffspear;
                        chatMessageContent += `<br> Total attack : ${roll2.total} + ${Att_Ref} + ${Att_staffspear} = ${attack_roll} `;
                   }
                   if (Att_bonus) {
                    attack_roll += Att_bonus;
                    chatMessageContent += `<br>Bonus added, total : ${attack_roll}`;
                   }
                    // Compute crit (jet attq - jet def)
                    let overstat;
                    overstat = attack_roll - total_def;
                    if (Headshot) {
                        overstat -= 6;
                    } else {
                        overstat -= 1;
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


                    // Type of damage (if not aimed at the head)
                  
                    // If armor resists -> /2 damage
                    // Perforation doesn't divide by 2 if armor tanks that kind of damage
                    // Perforation+ -> Defense/2

                    // Verifying Armor resistance &  attack
                    let type_of_damage = ["bludgeoning","piercing","slashing"]
                    let def_armor_resisted = false;
                      if (!Headshot) {
                        if (attack_typeB0P1S2 != 9) {
                        console.log(Defender.actor.itemTypes.enhancement);
                          for (enh of Defender.actor.itemTypes.enhancement) {
                            
                            console.log(`Checking enhancement: ${enh.name || 'Unnamed Enhancement'}`);

                                let damageType = type_of_damage[attack_typeB0P1S2];
                                let resistanceFlagPath = `system.${damageType}`; // e.g., "system.bludgeoning"
        
                                // Use getProperty for safety, in case the path doesn't exist on all items
                                let resistsThisType = getProperty(enh, resistanceFlagPath);

                                if (resistsThisType === true) { 
                                    def_armor_resisted = true;
                                    //console.log(`Enhancement '${enh.name}' resists ${damageType} damage.`);
                                    chatMessageContent += `<br>🛡️ Enhancement '${enh.name}' resists ${damageType} damage.`;
                                    degats = parseInt(degats/2);
                                    //console.log(degats);
                                    // If you only need ONE resistance to be true, you can break both loops
                                    break; // Break from inner loop (damageType loop)
                                }             
                        }
                     }
                    }


                        
                    
                    if (perforation && !perforation_plus) {
                        chatMessageContent += `The attack was piercing : effect ignored. `;
                        degats = parseInt(degats*2);
                    } else if (perforation_plus) {
                        chatMessageContent += `The attack was piercing+ : effect ignored and armor/2.`;
                        armorValue = parseInt(armorValue/2);
                    }

                    // Final computing
                    //console.log(`dmg : '${degats}' / c : '${mod_c}' / a : '${armorValue}' / cr : '${crit}' `);
                    if (Headshot) {
                        f_dam = (degats + mod_c - armorValue)*3 + crit
                        chatMessageContent += `<br> Total damage : (${degats} + ${mod_c} - ${armorValue})*3 + ${crit} = ${f_dam} `;
                    } else {
                        f_dam = (degats + mod_c - armorValue)*1 + crit
                        chatMessageContent += `<br> Total damage : (${degats} + ${mod_c} - ${armorValue})*1 + ${crit} = ${f_dam} `;
                    }

                    if (f_dam < 0) {
                        f_dam = 0;
                    }
                    
                    // Powerful, multiply by 2
                    if (estPuissante){
                        chatMessageContent += `<br>🫀 Powerful hit, multiply by 2 damage : ${f_dam} * 2 `;
                        f_dam*=2;
                    }

                    chatMessageContent += `<br>🫀 Final damage : ${f_dam} `;
                    
                    console.log("Updating HP...");
                    // Update HP
                    const updateData = {};
                    updateData[hpValuePath] = currentHp - f_dam;
                    if (currentHp - f_dam > 0) {
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

/*
To do : 

- Type of damage 
canvas.tokens.controlled[0].actor.itemTypes.weapon[0].system.type.bludgeoning/elemental/piercing/slashing -> True or false

canvas.tokens.controlled[0].actor.itemTypes.armor[0].system.bludgeoning/piercing/slashing -> True or false USELESS
It's here : canvas.tokens.controlled[0].actor.itemTypes.enhancement[i]
Then : canvas.tokens.controlled[0].actor.itemTypes.enhancement[0].system.piercing / canvas.tokens.controlled[0].actor.itemTypes.enhancement[0].system.slashing -> True False !
It also adds stopping power...



*/

function PJArmor(Headshot,UpperOrLower) {

    // Check Armor
    let Defender = canvas.tokens.controlled[1];
    let armor_list = Defender.actor.itemTypes?.armor;
    if (armor_list === undefined) {
        console.log("undef0");
        return 0;
    }

    // If pieces exist 
    for (const armor_piece of armor_list) {
        
        if (armor_piece !== undefined && armor_piece.system.equipped !== undefined) {    // Prevent bugs & if equipped
            console.log(armor_piece);
            const isEquipped = getProperty(armor_piece, "system.equipped");         
            // Get properties
            let buffer_head_power = getProperty(armor_piece, "system.headStopping");
            let buffer_torso_power = getProperty(armor_piece, "system.torsoStopping");
            let buffer_legs_power = getProperty(armor_piece, "system.rightLegStopping");
            //leftLegStopping

            // headshot
            if (Headshot) {
                if (buffer_head_power !== undefined && buffer_head_power !== 0) {   // if not bugged and different than 0
                    // We found what we were interested in 
                    console.log("PJHeadshot");
                    // Durability
                    let buffer_name = getProperty(armor_piece, "name");
                    durability(buffer_name,["system.headStopping"],isEquipped);
                    return buffer_head_power;
                }
            } else if (UpperOrLower) {    // Upper shot
                
                if (buffer_torso_power !== undefined && buffer_torso_power !== 0) {   // if not bugged and different than 0
                    // We found what we were interested in
                    // Durability
                    console.log("PJtorsoshot");
                    let buffer_name = getProperty(armor_piece, "name");
                    durability(buffer_name,["system.torsoStopping"],isEquipped);
                    return buffer_torso_power;
                }
                 
            } else {    // Lower

                if (buffer_legs_power !== undefined && buffer_legs_power !== 0) {   // if not bugged and different than 0
                    // We found what we were interested in
                    console.log("PJlegshot");
                    // Durability
                    let buffer_name = getProperty(armor_piece, "name");
                    durability(buffer_name,["system.rightLegStopping","system.leftLegStopping"],isEquipped);
                    return buffer_legs_power;
                }

            }
            
        } 
    }
    return 0; // Nothing else
}

async function durability(itemName,propertiesToModify,isEquipped) {

    console.log(`isequipped "${isEquipped}"`);

    let Defender = canvas.tokens.controlled[1];
    const armorItem = Defender.actor.itemTypes.armor.find(item => item.name === itemName);

    // Renomme si on a l'item en double (si 3 fois le meme ça marchera pas...)
    if (isEquipped !== true) { // Vérifie explicitement si ce n'est PAS true
        ui.notifications.warn(`L'armure "${itemName}" de ${defenderActor.name} n'est pas équipée.`);
        console.log(`L'armure "${itemName}" n'est pas équipée. isEquipped:`, isEquipped);
        
        const roll_armor = await new Roll("1d100").roll({async: true});
        const newName = `${armorItem.name} + ${roll_armor.total}`; // Nouveau nom aléatoire mais risque de probleme si vraiment pas de chance
        try {
            await armorItem.update({ name: newName }); // Met à jour la propriété 'name' de l'item
            ui.notifications.info(`L'armure "${itemName}" a été renommée en "${newName}".`);
   
        } catch (e) {
            ui.notifications.error(`Erreur lors du renommage de l'armure "${itemName}".`);
            console.error("Erreur de renommage de l'item:", e);
        }

    }

    // 3. Préparer l'objet de mise à jour pour l'item
    let updateData = {};
    let changesMade = false;
    const feedbackMessages = [];

    // 4. Parcourir chaque propriété à modifier
    for (const propPath of propertiesToModify) {
        const currentValue = getProperty(armorItem, propPath);

        if (typeof currentValue === 'number' && currentValue > 0) {
            const newValue = currentValue - 1;
            updateData[propPath] = newValue; // Ajoute la modification à l'objet updateData
            changesMade = true;
            feedbackMessages.push(`  - ${propPath} : ${currentValue} -> ${newValue}`);
        } else if (typeof currentValue === 'number' && currentValue === 0) {
            feedbackMessages.push(`  - ${propPath} : déjà à 0, pas de changement.`);
        } else {
            feedbackMessages.push(`  - ${propPath} : non trouvé ou n'est pas un nombre sur l'armure "${itemName}".`);
            console.warn(`Propriété '${propPath}' non trouvée ou n'est pas un nombre sur l'item d'armure:`, armorItem);
        }
    }

    // 5. Effectuer la mise à jour de l'item si des changements sont nécessaires
    if (changesMade) {
        try {
            await armorItem.update(updateData);
            //chatMessageContent += `Durabilité de l'armure "${itemName}" de **${Defender.actor.name}** mise à jour :<br>${feedbackMessages.join('<br>')}`;
            

            console.log(`Mise à jour de l'armure "${itemName}" pour ${Defender.actor.name}:`, updateData);

        } catch (e) {

            console.error("Erreur d'update de l'item d'armure:", e);
        }
    } else {

        console.log(`Aucun changement de durabilité effectué pour l'armure "${itemName}". Raisons:`, feedbackMessages.join(', '));
    }

    return 0;
}



async function PNJArmor(Headshot,UpperOrLower) {
    
    let Defender = canvas.tokens.controlled[1];
    // PNJ Armor
    const armorHeadValue = Defender.actor.system?.armorHead;
    const armorUpperValue = Defender.actor.system?.armorUpper;
    const armorLowerValue = Defender.actor.system?.armorLower;

   let updateData1 = {};

 
    if (Headshot) {
        const currentValue = getProperty(Defender.actor.system, "armorHead");
        if (typeof currentValue === 'number' && currentValue > 0) {
            let newvalue = currentValue-1;
            updateData1["system.armorHead"] = newvalue;
            await Defender.actor.update(updateData1);
            return newvalue;
        }
    } else if (UpperOrLower) {
        const currentValue = getProperty(Defender.actor.system, "armorUpper");
        if (typeof currentValue === 'number' && currentValue > 0) {
            let newvalue = currentValue-1;
            updateData1["system.armorUpper"] = newvalue;
            await Defender.actor.update(updateData1);
            return newvalue;
        }
    } else {
        const currentValue = getProperty(Defender.actor.system, "armorLower");
        if (typeof currentValue === 'number' && currentValue > 0) {
            let newvalue = currentValue-1;
            updateData1["system.armorLower"] = newvalue;
            await Defender.actor.update(updateData1);
            return newvalue;
        }
    }
    console.log("PNJ armor not found");
    return 0;
}