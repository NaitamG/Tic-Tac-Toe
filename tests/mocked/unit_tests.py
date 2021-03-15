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

INITIAL_USERNAME = 'obama'

class NotInTable(unittest.TestCase):
    """This checks the """
    # This will not handle duplicates nor empty strings
    def setUp(self):
        self.not_in_table_test_params = [
            {
                KEY_INPUT: 'naitam',
                KEY_EXPECTED: [INITIAL_USERNAME, 'naitam'],
            },
            {
                KEY_INPUT: 'naitam',
                KEY_EXPECTED: [INITIAL_USERNAME, 'naitam', 'naitam'],
            },
            {
                KEY_INPUT: 'someone',
                KEY_EXPECTED: [INITIAL_USERNAME, 'naitam', 'naitam', 'someone'],
            },
            {
                KEY_INPUT: '',
                KEY_EXPECTED: [INITIAL_USERNAME, 'naitam', 'naitam', 'someone', ''],
            },
        ]
        initial_person = models.Leaderboard(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [initial_person]

    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)

    def mocked_db_session_commit(self):
        pass

    def mocked_db_session_close(self):
        pass

    def mocked_person_query_all(self):
        return self.initial_db_mock

    def test_success(self):
        for test in self.not_in_table_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('app.DB.session.close', self.mocked_db_session_close):
                        with patch('models.Leaderboard.query') as mocked_query:
                            mocked_query.all = self.mocked_person_query_all

                            actual_result = not_in_table(test[KEY_INPUT])
                            expected_result = test[KEY_EXPECTED]
                            
                            self.assertEqual(len(actual_result), len(expected_result))
                            self.assertEqual(actual_result[1], expected_result[1])


KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'naitam'

class CheckTable(unittest.TestCase):
    def setUp(self):
        self.check_table_test_params = [
            {
                KEY_INPUT: "naitam",
                KEY_EXPECTED: True
            },
            {
                KEY_INPUT: "someone",
                KEY_EXPECTED: True
            },
            {
                KEY_INPUT: "extra",
                KEY_EXPECTED: True
            },
            {
                KEY_INPUT: "here",
                KEY_EXPECTED: True
            },
        ]
        initial_list = models.Leaderboard(username=INITIAL_USERNAME)
        add_one = models.Leaderboard(username='someone')
        add_one_more = models.Leaderboard(username='here')
        add_one_another = models.Leaderboard(username='extra')
        
        self.initial_db_mock = [initial_list, add_one, add_one_more, add_one_another]
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_db_session_close(self):
        pass
    
    def mocked_db_session_filter(self, user):
        if (user in self.initial_db_mock):
            return True
        else:
            return False
    
    def mocked_player_query_all(self):
        return self.initial_db_mock
    
    def test_check_table(self):
        for test in self.check_table_test_params:
            with patch('models.Leaderboard.query') as mocked_query:

                actual_result = check_table(test[KEY_INPUT])
                expected_result = test[KEY_EXPECTED]
                
                self.assertEqual(actual_result, expected_result)
                self.assertTrue(actual_result)

if __name__ == '__main__':
    unittest.main()