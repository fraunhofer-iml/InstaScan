# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""Define the Document-Analyzation-Service."""

import os

__version__ = "0.0.1" + os.environ.get("PACKAGE_VERSION_EXTENSION", "")
