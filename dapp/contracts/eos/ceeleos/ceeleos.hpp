;
#pragma once
#define VACCOUNTS_DELAYED_CLEANUP 120

#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

#include "../dappservices/multi_index.hpp"
#include "../dappservices/log.hpp"
#include "../dappservices/oracle.hpp"
#include "../dappservices/vaccounts.hpp"
#include "../dappservices/readfn.hpp"
#include "../dappservices/vcpu.hpp"
#include "../dappservices/multi_index.hpp"

#define DAPPSERVICES_ACTIONS() \
  XSIGNAL_DAPPSERVICE_ACTION \
  IPFS_DAPPSERVICE_ACTIONS \
  VACCOUNTS_DAPPSERVICE_ACTIONS \
  LOG_DAPPSERVICE_ACTIONS \
  ORACLE_DAPPSERVICE_ACTIONS \
  VCPU_DAPPSERVICE_ACTIONS \
  READFN_DAPPSERVICE_ACTIONS
#define DAPPSERVICE_ACTIONS_COMMANDS() \
  IPFS_SVC_COMMANDS()ORACLE_SVC_COMMANDS()VACCOUNTS_SVC_COMMANDS()LOG_SVC_COMMANDS()READFN_SVC_COMMANDS()VCPU_SVC_COMMANDS()
#define CONTRACT_NAME() ceeleos
using std::string;

using namespace std;
using namespace eosio;

CONTRACT_START()
    private:
        enum game_status: int8_t {
            ONGOING = 0,
            PLAYER_WON = 1,
            PLAYER_LOST = -1
        };
        
        struct game {
            uint8_t status = ONGOING;
            vector<uint8_t> playerDice = {0, 0, 0};
            vector<uint8_t> enemyDice = {0, 0, 0};
            
        };
        // Users will have a table with all their data needed for the game
        // @abi table user_info i64
        struct [[eosio::table]] user_info {
            name            username;
            game            game_data;
            auto primary_key() const { return username.value; }
        };
        
        // @abi table seed i64
        struct [[eosio::table]] seed {
            uint64_t        key = 1;
            uint32_t        value = 1;
            auto primary_key() const { return key; }
        };
        /* TABLE account {
            extended_asset balance;
            uint64_t primary_key()const { return balance.contract.value; }
        }; */
        typedef dapp::multi_index<"users"_n, user_info> users_table;
        typedef eosio::multi_index<".users"_n, user_info> users_table_v_abi;
        TABLE shardbucket {
            std::vector<char> shard_uri;
            uint64_t shard;
            uint64_t primary_key() const { return shard; }
        };
        typedef eosio::multi_index<"users"_n, shardbucket> users_table_abi;
        typedef eosio::multi_index<name("seed"), seed> seed_table;
        users_table _users;
        seed_table _seed;
        
        void roll(vector<uint8_t>& dice);
        
        int random(const int range);
        void update_game_status(user_info& user);
    public:
        ceeleos( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
                       _users(receiver, receiver.value, 1024, 64, false, false, VACCOUNTS_DELAYED_CLEANUP),
                       _seed(receiver, receiver.value) {}
        
        struct player_struct {
            name username;
            EOSLIB_SERIALIZE( player_struct, (username) )
        };
        // @abi action
        [[eosio::action]] 
        void login(player_struct vaccount);
    
        [[eosio::action]] 
        void startgame(player_struct vaccount);
        [[eosio::action]]
        void endgame(player_struct vaccount);
        [[eosio::action]]
        void nextroll(player_struct vaccount);
        VACCOUNTS_APPLY(((player_struct)(login))((player_struct)(startgame))((player_struct)(endgame))((player_struct)(nextroll)))
CONTRACT_END((login)(startgame)(endgame)(nextroll)(xdcommit)(regaccount))