"""
Mocked unit testing

"""
import os, sys
import unittest
import unittest.mock as mock
from unittest.mock import patch

sys.path.append(os.path.abspath('../../'))
from app import *

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class UpdateTable(unittest.TestCase):
    def setUp(self):
        self.update_table_test_params = [
            {
                KEY_INPUT: [],
                KEY_EXPECTED: []
            },
            {
                USER_INPUT: ["first"],
                SCORE_INPUT: [101],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
            {
                USER_INPUT: ["second", "first"],
                SCORE_INPUT: [101, 200],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
            {
                USER_INPUT: [],
                SCORE_INPUT: [],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
        ]
        initial_list = DB.session.query(models.Leaderboard)
        self.initial_db_mock = [initial_list]
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_db_session_close(self):
        pass
        
    def mocked_player_query_order(self, order):
        
        return self.initial_db_mock
    
    def mocked_player_query_all(self):
        return self.initial_db_mock
    
    def test_check_table(self):
        for test in self.update_table_test_params:
            with patch('app.DB.session.commit', self.mocked_db_session_commit):
                with patch('app.DB.session.close', self.mocked_db_session_close):
                    with patch('models.Leaderboard.query') as mocked_query:
                        mocked_query.order(desc(models.Leaderboard.score)) = self.mocked_player_query_order
                        mocked_query.all = self.mocked_player_query_all
    
                        print(self.initial_db_mock)
                        actual_result = add_user(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result[1], expected_result[1])

if __name__ == '__main__':
    unittest.main()