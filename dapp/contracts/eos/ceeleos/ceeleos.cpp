#include "ceeleos.hpp"
#include "gameplay.cpp"

void ceeleos::login(player_struct vaccount) {
    auto username = vaccount.username;
    // Ensure this action is authorized by the player
    require_vaccount(username);

    auto user_iterator = _users.find(username.value);
    if (user_iterator == _users.end()) {
    // create a new record for the user (_users)
    user_iterator = _users.emplace(username, [&](auto& new_user) {
            new_user.username = username;
        });
    }
}

void ceeleos::startgame(player_struct vaccount) {
  auto username = vaccount.username;
  // Ensure this action is authorized by the player
  require_vaccount(username);
  
  auto& user_data = _users.get(username.value, "User doesn't exist");
  
  _users.modify(user_data, username, 
    [&](auto& modified_user_data) {
      // Create a new game
      game game_data;
      
      // Assign a starting random dice roll for the player and the AI
      roll(game_data.playerDice);
      roll(game_data.enemyDice);
      
      // Assign this game we just created to the player
      modified_user_data.game_data = game_data;
  });
}

void ceeleos::endgame(player_struct vaccount) {
    // Ensure this action is authorized by the player
    auto username = vaccount.username;
    require_vaccount(username);

    // Reward winner
    
    // Get the user and reset the game
    auto& user = _users.get(username.value, "User doesn't exist");
    _users.modify(user, username, [&](auto& modified_user) {
        modified_user.game_data = game();
    });
}

void ceeleos::nextroll(player_struct vaccount) {
    name username = vaccount.username;
    // Ensure this action is authorized by the player
    require_vaccount(username);

    auto& user = _users.get(username.value, "User doesn't exist");

    // Verify game status
    eosio::check(user.game_data.status == ONGOING, 
              "nextround: This game has ended. Please start a new one.");

    _users.modify(user, username, [&](auto& modified_user) {
        game& game_data = modified_user.game_data;

        // Roll for the player and AI
        roll(game_data.playerDice);
        roll(game_data.enemyDice);

        // Check win
        update_game_status(modified_user);
  });

}
