#include "ceeleos.hpp"
#include <algorithm>

// Simple Pseudo Random Number Algorithm, randomly pick a number within 0 to n-1
int ceeleos::random(const int range) {
    // find the existing seed 
    auto seed_iterator = _seed.begin();
    // initialize the seed if not found (if not used)
    if (seed_iterator == _seed.end()) {
        seed_iterator = _seed.emplace(_self, [&](auto& seed) {
            // defaults are good enough
        });
    }

    // Generate new seed value using the existing seed value
    int prime = 65337;
    auto new_seed_value = (seed_iterator->value + eosio::current_time_point().sec_since_epoch()) % prime;

    // Store the updated seed value in the table
    _seed.modify(seed_iterator,_self,[&](auto& seed){
        seed.value = new_seed_value;
    });

    // Get the random result in desired range
    int random_result = new_seed_value % range;
    return random_result;
}

void ceeleos::roll(vector<uint8_t>& dice) {
  
    //roll all three dice for player
    for (int dice_rolled = 0; dice_rolled < 3; dice_rolled++) {
        dice[dice_rolled] = random(6); // 6 sides to a die
    }
}

void ceeleos::update_game_status(user_info& user) {
    game& game_data = user.game_data;

    // copy dice vectors
    vector<uint8_t> pDice(game_data.playerDice);
    vector<uint8_t> eDice(game_data.enemyDice);
    // sort dice vectors
    std::sort(pDice.begin(), pDice.end());
    std::sort(eDice.begin(), eDice.end());
    
    // if tie, return
    if (game_data.playerDice == game_data.enemyDice) return;

    vector<uint8_t> instant_loss = {1, 2, 3};
    vector<uint8_t> instant_win = {4, 5, 6};

    // if player gets a {1, 2, 3}, they lose
    if (pDice == instant_loss) {
        game_data.status = PLAYER_LOST;
    } else if (eDice == instant_loss) {
        game_data.status = PLAYER_WON;
    } else if (pDice == instant_win) {
        game_data.status = PLAYER_WON;
    } else if (eDice == instant_win) {
        game_data.status = PLAYER_LOST;
    } else {
        int player_number;
        bool player_triple = false;

        int enemy_number;
        bool enemy_triple = false;

        if (pDice[0] == pDice[1] && pDice[1] == pDice[2]) {
            // player rolled a triple
            player_triple = true;
            player_number = pDice[0]; // doesn't matter which value we choose, all dice are the same
        } else {
            // player rolled a double
            if (pDice[0] == pDice[1]) {
                player_number = pDice[2];
            } else if (pDice[0] == pDice[2]) {
                player_number = pDice[1];
            } else if (pDice[1] == pDice[2]) {
                player_number = pDice[0];
            }
        }

        if (eDice[0] == eDice[1] && eDice[1] == eDice[2]) {
            // enemy rolled a triple
            enemy_triple = true;
            enemy_number = eDice[0]; // doesn't matter which value we choose, all dice are the same
        } else {
            // player rolled a double
            if (eDice[0] == eDice[1]) {
                enemy_number = eDice[2];
            } else if (eDice[0] == eDice[2]) {
                enemy_number = eDice[1];
            } else if (eDice[1] == eDice[2]) {
                enemy_number = eDice[0];
            }
        }

        if (player_triple) {
            if (enemy_triple) {
                if (player_number == enemy_number) { // if tied, return
                    return;
                } else if (player_number > enemy_number) {
                    game_data.status = PLAYER_WON;
                } else if (enemy_number > player_number) {
                    game_data.status = PLAYER_LOST;
                }
            } else {
                game_data.status = PLAYER_WON;
            }
        } else {
            if (enemy_triple) {
                game_data.status = PLAYER_LOST;
            } else {
                if (player_number == enemy_number) { // if tied, return
                    return;
                } else if (player_number > enemy_number) {
                    game_data.status = PLAYER_WON;
                } else if (enemy_number > player_number) {
                    game_data.status = PLAYER_LOST;
                }
            }
        }
    }
}