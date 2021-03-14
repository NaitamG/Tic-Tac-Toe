"""
Mocked unit testing

"""
import os, sys
import unittest
import unittest.mock as mock
from unittest.mock import patch

sys.path.append(os.path.abspath('../../'))
from app import *


USER_INPUT = "users"
SCORE_INPUT = "scores"
EXPECTED_USER_OUTPUT = "user table"
EXPECTED_SCORE_OUTPUT = "score table"

class updateTable(unittest.TestCase):
    def setUp(self):
        self.updat_table_test_params = [
            {
                USER_INPUT: [],
                SCORE_INPUT: [],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
            {
                USER_INPUT: ["first"],
                SCORE_INPUT: [101],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
            {
                USER_INPUT: ["first", "second"],
                SCORE_INPUT: [101, 200],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
            {
                USER_INPUT: ["this", "that"],
                SCORE_INPUT: [],
                EXPECTED_USER_OUTPUT: [],
                EXPECTED_SCORE_OUTPUT: []
            },
        ]
        
    def test_check_table(self):
        for test in self.updat_table_test_params:
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
            actual_result = update_table(test[USER_INPUT], test[SCORE_INPUT])
            print(actual_result)
            # Assign the expected output as a variable from test
            expected_result = test[EXPECTED_OUTPUT]

            # Use assert checks to see compare values of the results
            #self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()