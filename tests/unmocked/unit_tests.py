"""
Unmocked unit testing
"""
import unittest
from app import *

USERNAME_INPUT = "username"
USERS_INPUT = 'users'
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.login_success_test_params = [
            {
                USERNAME_INPUT: "Naman",
                USERS_INPUT: {
                    'player_x': None,
                    'player_o': None,
                    'spectators': [],
                },
                EXPECTED_OUTPUT: {
                    'player_x': "Naman",
                    'player_o': None,
                    'spectators': [],
                }
            },
            {
                USERNAME_INPUT: "Naman2",
                USERS_INPUT: {
                    'player_x': "Naman",
                    'player_o': None,
                    'spectators': [],
                },
                EXPECTED_OUTPUT: {
                    'player_x': "Naman",
                    'player_o': "Naman2",
                    'spectators': [],
                }
            },
            # TODO add another test case
        ]

    def test_add_user(self):
        for test in self.login_success_test_params:
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
            #actual_result = add_user(test[USERNAME_INPUT], test[USERS_INPUT])
            
            # Assign the expected output as a variable from test
            #expected_result = test[EXPECTED_OUTPUT]

            # Use assert checks to see compare values of the results
            #self.assertEqual()
            #self.assertEqual()


if __name__ == '__main__':
    unittest.main()