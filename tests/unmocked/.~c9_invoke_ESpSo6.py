"""
Unmocked unit testing
"""
import os, sys
import unittest
sys.path.append(os.path.abspath('../../'))

from app import *

"""
USERNAME_INPUT = "username"
EXPECTED_OUTPUT = "exists"

class checkTable(unittest.TestCase):
    def setUp(self):
        self.check_table_test_params = [
            {
                USERNAME_INPUT: "naitam", # already in table
                EXPECTED_OUTPUT: True
            },
            {
                USERNAME_INPUT: "obama", # already in table
                EXPECTED_OUTPUT: True
            },
            {
                USERNAME_INPUT: "someone new", # not in table
                EXPECTED_OUTPUT: False
            },
            {
                USERNAME_INPUT: "another new person", # not in table
                EXPECTED_OUTPUT: False
            }
            # TODO add another test case
        ]

    def test_check_table(self):
        count = 0
        for test in self.check_table_test_params:
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
            actual_result = check_table(test[USERNAME_INPUT])
            # Assign the expected output as a variable from test
            expected_result = test[EXPECTED_OUTPUT]

            # Use assert checks to see compare values of the results
            self.assertEqual(actual_result, expected_result)
            
            if (count == 0 or count == 1): # check the first two only
                self.assertTrue(actual_result, expected_result)
            
            if (count == 2 or count == 3): # check the last two only
                self.assertFalse(actual_result, expected_result)
            count += 1

"""
INPUT = "new"
EXPECTED_LEADERBOARD = "updated"

class getLeaderboard(unittest.TestCase):
    """See if players and their score are appending in the dictionary"""
    # the testd value will not be sorted nor persisted
    def setUp(self):
        self.get_leaderboard_test_params = [
            {
                
                INPUT: {
                    "players": [],
                    "score": []
                },
                EXPECTED_LEADERBOARD: { # the persisted table that's already in db
                    "players": ['naitam', 'op', 'user4', 'here2', 'newnewnew', 'newone', ' user4', 'user3', 'One person', 'There', 'naiam', 'newnew', 'user', 'onemore', 'newUser', 'there', 'obama', 'user2', 'here'],
                    "score": [117, 102, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 98, 97, 96, 91]
                }
            },
            {
                INPUT: { # check to see if a unique name and score are added
                    "players": ['new guy'],
                    "score": [100]
                },
                EXPECTED_LEADERBOARD: {
                    "players": ['new guy', 'naitam', 'op', 'user4', 'here2', 'newnewnew', 'newone', ' user4', 'user3', 'One person', 'There', 'naiam', 'newnew', 'user', 'onemore', 'newUser', 'there', 'obama', 'user2', 'here'],
                    "score": [100, 117, 102, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 98, 97, 96, 91]
                }
            },
            {
                INPUT: { # check to see if a duplicate username can be added
                    "players": ['naitam'],
                    "score": [1002]
                },
                EXPECTED_LEADERBOARD: {
                    "players": ['naitam', 'naitam', 'op', 'user4', 'here2', 'newnewnew', 'newone', ' user4', 'user3', 'One person', 'There', 'naiam', 'newnew', 'user', 'onemore', 'newUser', 'there', 'obama', 'user2', 'here'],
                    "score": [1002, 117, 102, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 98, 97, 96, 91]
                }
            },
            {
                INPUT: { # check to see if an exact user and score can be added
                    "players": ['naitam'],
                    "score": [117]
                },
                EXPECTED_LEADERBOARD: {
                    "players": ['naitam', 'naitam', 'op', 'user4', 'here2', 'newnewnew', 'newone', ' user4', 'user3', 'One person', 'There', 'naiam', 'newnew', 'user', 'onemore', 'newUser', 'there', 'obama', 'user2', 'here'],
                    "score": [117, 117, 102, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 98, 97, 96, 91]
                }
            },
        ]
    
    def test_get_leaderboard(self):
        for test in self.get_leaderboard_test_params:
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
            actual_result = get_leaderboard(test[INPUT])
            # Assign the expected output as a variable from test
            #expected_result = test[UPDATED_LEADERBOARD]
            #print(expected_result)
            # Use assert checks to see compare values of the results
            #self.assertEqual(actual_result, expected_result)
            
if __name__ == '__main__':
    unittest.main()